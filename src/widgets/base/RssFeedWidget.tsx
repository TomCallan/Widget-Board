import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Rss } from 'lucide-react';

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
}

interface Feed {
    title: string;
    items: FeedItem[];
}

const RssFeedWidget: React.FC<WidgetProps> = ({ widget: { config } }) => {
  const rssUrl = config.rssUrl || 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml';
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rssUrl) {
      setError('RSS feed URL is not configured.');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    // Using a CORS proxy to avoid browser CORS issues.
    // This is a public proxy, for production use a self-hosted one.
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

    fetch(proxyUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status.http_code !== 200) {
            throw new Error(`Failed to fetch RSS feed. Status: ${data.status.http_code}`);
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
        
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
          throw new Error('Failed to parse RSS feed.');
        }

        const feedTitle = xmlDoc.querySelector('channel > title')?.textContent || 'RSS Feed';
        const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: new Date(item.querySelector('pubDate')?.textContent || '').toLocaleString(),
        })).slice(0, 20); // Limit to 20 items

        setFeed({ title: feedTitle, items });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [rssUrl]);

  return (
    <div className="p-4 h-full flex flex-col text-white">
      {loading && <div className="text-center text-white/50">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {!loading && !error && (
        <>
            {feed && <h3 className="text-lg font-bold mb-2 truncate" title={feed.title}>{feed.title}</h3>}
            <ul className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-transparent">
            {feed?.items.map((item, index) => (
                <li key={index} className="mb-3 pb-3 border-b border-white/10 last:border-b-0">
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent-400 transition-colors">
                    {item.title}
                </a>
                <p className="text-xs text-white/50 mt-1">{item.pubDate}</p>
                </li>
            ))}
            </ul>
        </>
      )}
    </div>
  );
};

export const rssFeedWidgetConfig: WidgetConfig = {
    type: 'base-rss-feed',
    name: 'RSS Feed',
    description: 'Displays items from an RSS feed.',
    version: '1.0.0',
    defaultSize: { width: 320, height: 400 },
    minSize: { width: 280, height: 240 },
    maxSize: { width: 600, height: 800 },
    component: RssFeedWidget,
    icon: Rss,
    features: {
      resizable: true,
      fullscreenable: true,
      configurable: true,
    },
    configFields: {
      rssUrl: {
        type: 'text',
        label: 'RSS Feed URL',
        defaultValue: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
      },
    },
    categories: ['Information'],
    tags: ['rss', 'feed', 'news'],
    author: {
      name: 'Your Name',
    },
}; 