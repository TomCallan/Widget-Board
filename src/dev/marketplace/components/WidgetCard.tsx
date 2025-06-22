import React from 'react';
import type { MarketplaceWidget } from '../types';
import { Download, ArrowUpDown, Maximize2, Settings } from 'lucide-react';

interface WidgetCardProps {
  widget: MarketplaceWidget;
  onInstall: () => void;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ widget, onInstall }) => {
  return (
    <div className="widget-card">
      <div className="widget-card-header">
        <div className="widget-preview">{widget.preview}</div>
        <div className="widget-title-container">
          <h3 className="widget-title">{widget.name}</h3>
          <p className="widget-author">by {widget.author}</p>
        </div>
      </div>

      <p className="widget-description">{widget.description}</p>

      <div className="widget-tags">
        {widget.tags.map(tag => (
          <span key={tag} className="widget-tag">
            {tag}
          </span>
        ))}
        <span className="widget-tag">
          {widget.category}
        </span>
      </div>

      <button
        onClick={onInstall}
        className="install-button"
      >
        <Download size={18} />
        Install Widget
      </button>

      <div className="widget-metadata">
        <div className="widget-metadata-item">
          300 × 200
        </div>
        <div className="widget-metadata-item" title="Resizable">
          <ArrowUpDown size={12} />
        </div>
        <div className="widget-metadata-item" title="Fullscreen Support">
          <Maximize2 size={12} />
        </div>
        <div className="widget-metadata-item" title="Configurable">
          <Settings size={12} />
        </div>
      </div>
    </div>
  );
}; 