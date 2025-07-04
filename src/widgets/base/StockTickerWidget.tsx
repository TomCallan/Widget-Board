import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { TrendingUp } from 'lucide-react';

interface StockData {
  'Global Quote': {
    '01. symbol': string;
    '05. price': string;
    '09. change': string;
    '10. change percent': string;
  };
}

const StockTickerWidget: React.FC<WidgetProps> = ({ widget: { config } }) => {
  const symbols = (config.symbols || 'AAPL,GOOGL,MSFT').split(',').map((s: string) => s.trim());
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiKey = config.apiKey;

  useEffect(() => {
    if (!apiKey) {
      setError('API key not configured.');
      setLoading(false);
      return;
    }

    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all(
          symbols.map((symbol: string) => 
            fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`)
              .then(res => res.json())
          )
        );
        // AlphaVantage free tier has a limit of 5 calls per minute.
        // If we get a "Note" in the response, it means we hit the limit.
        const rateLimitNote = responses.find(r => r.Note);
        if (rateLimitNote) {
          setError('API rate limit reached. Please wait a minute.');
        } else {
          setStockData(responses);
        }
      } catch (err) {
        setError('Failed to fetch stock data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000 * 2); // Refresh every 2 minutes
    return () => clearInterval(interval);
  }, [symbols, apiKey]);

  return (
    <div className="p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-transparent">
      <h3 className="text-lg font-bold mb-2 text-white">Stock Ticker</h3>
      {loading && <div className="text-center text-white/50">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <ul>
          {stockData.map((data, index) => {
            const quote = data['Global Quote'];
            if (!quote || Object.keys(quote).length === 0) {
              return <li key={index} className="py-2 border-b border-white/10 text-white/70">{symbols[index]}: No data. Check symbol or API key.</li>;
            }
            const change = parseFloat(quote['09. change']);
            const changeColor = change >= 0 ? 'text-green-400' : 'text-red-400';
            return (
              <li key={quote['01. symbol']} className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="font-bold text-white">{quote['01. symbol']}</span>
                <div className="text-right font-mono">
                  <div className="text-white">${parseFloat(quote['05. price']).toFixed(2)}</div>
                  <div className={changeColor}>
                    {change.toFixed(2)} ({quote['10. change percent']})
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const stockTickerWidgetConfig: WidgetConfig = {
  type: 'base-stock-ticker',
  name: 'Stock Ticker',
  description: 'Displays real-time stock prices.',
  version: '1.0.0',
  defaultSize: { width: 280, height: 240 },
  minSize: { width: 220, height: 200 },
  maxSize: { width: 600, height: 800 },
  component: StockTickerWidget,
  icon: TrendingUp,
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: true,
  },
  configFields: {
    symbols: {
      type: 'textarea',
      label: 'Stock Symbols',
      description: 'Enter stock symbols, separated by commas (e.g., AAPL,GOOGL,MSFT).',
      defaultValue: 'AAPL,GOOGL,MSFT',
    },
    apiKey: {
        type: 'authKey',
        label: 'Alpha Vantage API Key',
        service: 'AlphaVantage',
        description: 'Get a free API key from alphavantage.co',
    },
  },
  categories: ['Information'],
  tags: ['stocks', 'finance', 'market'],
  author: {
    name: 'Your Name',
  },
}; 