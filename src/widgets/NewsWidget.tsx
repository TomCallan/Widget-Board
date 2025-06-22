import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../types/widget';
import { Newspaper, ExternalLink, RefreshCw } from 'lucide-react';

export const NewsWidget: React.FC<WidgetProps> = ({ widget }) => {
  const [news, setNews] = useState([
    {
      id: 1,
      title: 'Tech Industry Sees Major Breakthrough in AI Development',
      source: 'Tech News',
      time: '2 hours ago',
      url: '#'
    },
    {
      id: 2,
      title: 'Global Markets Show Strong Performance This Quarter',
      source: 'Financial Times',
      time: '4 hours ago',
      url: '#'
    },
    {
      id: 3,
      title: 'New Environmental Policies Announced by Government',
      source: 'News Today',
      time: '6 hours ago',
      url: '#'
    },
    {
      id: 4,
      title: 'Space Exploration Mission Achieves Historic Milestone',
      source: 'Science Daily',
      time: '8 hours ago',
      url: '#'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshNews = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Latest News</h3>
        <button
          onClick={refreshNews}
          className={`p-1 hover:bg-white/10 rounded transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}
        >
          <RefreshCw size={14} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {news.map(article => (
          <div key={article.id} className="group">
            <a
              href={article.url}
              className="block p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <h4 className="text-sm font-medium mb-1 line-clamp-2 group-hover:text-purple-300">
                {article.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>{article.source}</span>
                <div className="flex items-center gap-1">
                  <span>{article.time}</span>
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};