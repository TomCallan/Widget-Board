import React, { useState } from 'react';
import { WidgetCard } from './WidgetCard';
import type { MarketplaceWidget } from '../types';
import { Plus, Tag } from 'lucide-react';

// Sample categories
const CATEGORIES = [
  'All',
  'Productivity',
  'Weather',
  'System',
  'Social',
  'Entertainment',
  'Development',
  'Custom'
];

// Sample data - in a real app this would come from an API
const SAMPLE_WIDGETS: MarketplaceWidget[] = [
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'A simple calculator widget for basic arithmetic operations',
    author: 'Dash Team',
    tags: ['utility', 'math'],
    preview: '🧮',
    category: 'Productivity'
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Shows current weather and forecast for your location',
    author: 'Dash Team',
    tags: ['weather', 'forecast'],
    preview: '🌤️',
    category: 'Weather'
  },
  {
    id: 'todo',
    name: 'Todo List',
    description: 'Keep track of your tasks and to-dos',
    author: 'Dash Team',
    tags: ['productivity', 'organization'],
    preview: '✅',
    category: 'Productivity'
  },
  {
    id: 'system-monitor',
    name: 'System Monitor',
    description: 'Monitor your system resources and performance',
    author: 'Dash Team',
    tags: ['system', 'performance'],
    preview: '📊',
    category: 'System'
  },
  {
    id: 'clock',
    name: 'Clock',
    description: 'A customizable clock widget with multiple time zones support',
    author: 'Dash Team',
    tags: ['time', 'utility'],
    preview: '🕐',
    category: 'Productivity'
  }
];

export const MarketplacePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [widgets] = useState(SAMPLE_WIDGETS);

  const filteredWidgets = widgets.filter(widget => {
    const matchesSearch = 
      widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'All' || widget.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleInstall = (widgetId: string) => {
    console.log(`Installing widget: ${widgetId}`);
    // TODO: Implement actual installation logic
  };

  return (
    <div className="marketplace-container">
      {/* Background Pattern */}
      <div className="marketplace-background-pattern"></div>
      
      {/* Grid Overlay */}
      <div className="grid-overlay"></div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Widget Marketplace</h1>
          <div className="flex items-center gap-3">
            <button className="submit-widget-button">
              <Plus size={18} />
              Submit Widget
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6">
        {/* Search */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search widgets by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Categories */}
        <div className="category-filter">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-button ${
                selectedCategory === category
                  ? 'category-button-active'
                  : 'category-button-inactive'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Widget Grid */}
        <div className="marketplace-grid">
          {filteredWidgets.map(widget => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              onInstall={() => handleInstall(widget.id)}
            />
          ))}

          {filteredWidgets.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-white/70">
              <Tag size={48} className="mb-4 opacity-50" />
              <p className="text-lg mb-2">No widgets found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}; 