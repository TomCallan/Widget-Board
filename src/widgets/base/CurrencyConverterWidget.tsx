import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Landmark } from 'lucide-react';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

const CurrencyConverterWidget: React.FC<WidgetProps> = ({ widget: { config } }) => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiKey = config.apiKey;

  useEffect(() => {
    if (!apiKey) {
      setError('API key not configured.');
      return;
    }

    setLoading(true);
    setError(null);
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.result === 'success') {
          const rate = data.conversion_rates[toCurrency];
          setResult(amount * rate);
        } else {
          setError(data['error-type'] || 'An error occurred');
        }
      })
      .catch(() => setError('Failed to fetch rates.'))
      .finally(() => setLoading(false));
  }, [amount, fromCurrency, toCurrency, apiKey]);

  return (
    <div className="p-4 h-full flex flex-col justify-center text-white">
      <h3 className="text-lg font-bold mb-4 text-center">Currency Converter</h3>
      {loading && <div className="text-center text-white/50">Loading...</div>}
      {error && <div className="text-red-500 text-center mb-2">{error}</div>}
      {!loading && !error && (
        <>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              style={{ colorScheme: 'dark' }}
            >
              {currencies.map(c => <option key={c} value={c} className="bg-gray-800 text-white">{c}</option>)}
            </select>
          </div>
          <div className="text-center text-2xl font-bold text-white/50">TO</div>
          <div className="flex items-center space-x-2 mt-4">
            <div className="w-full bg-white/5 p-2 rounded-lg text-center font-mono text-lg">
              {result !== null ? result.toFixed(2) : '...'}
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              style={{ colorScheme: 'dark' }}
            >
              {currencies.map(c => <option key={c} value={c} className="bg-gray-800 text-white">{c}</option>)}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export const currencyConverterWidgetConfig: WidgetConfig = {
    type: 'base-currency-converter',
    name: 'Currency Converter',
    description: 'Convert between different currencies.',
    version: '1.0.0',
    defaultSize: { width: 300, height: 220 },
    minSize: { width: 280, height: 220 },
    maxSize: { width: 400, height: 220 },
    component: CurrencyConverterWidget,
    icon: Landmark,
    features: {
      resizable: true,
      fullscreenable: false,
      configurable: true,
    },
    configFields: {
        apiKey: {
            type: 'authKey',
            label: 'ExchangeRate-API Key',
            service: 'ExchangeRate-API',
            description: 'Get a free API key from exchangerate-api.com',
        },
    },
    categories: ['Information'],
    tags: ['currency', 'converter', 'finance'],
    author: {
      name: 'Your Name',
    },
  }; 