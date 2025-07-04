import React from 'react';
import { MarketplaceWidget } from '../../types/marketplace';
import { 
  Star, Download, DollarSign, Shield, TrendingUp, 
  Clock, User, Tag, Loader2 
} from 'lucide-react';

interface MarketplaceGridProps {
  widgets: MarketplaceWidget[];
  loading: boolean;
  onWidgetSelect: (widget: MarketplaceWidget) => void;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  widgets,
  loading,
  onWidgetSelect
}) => {
  const formatPrice = (widget: MarketplaceWidget) => {
    if (widget.price.type === 'free') {
      return 'Free';
    }
    return `$${widget.price.amount.toFixed(2)}`;
  };

  const formatDownloads = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (widgets.length === 0) {
    return (
      <div className="text-center py-12 text-white/50">
        <div className="text-lg mb-2">No widgets found</div>
        <div className="text-sm">Try adjusting your search or filters</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          onClick={() => onWidgetSelect(widget)}
          className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group border border-white/10 hover:border-purple-500/30"
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
              {widget.icon ? (
                <img 
                  src={widget.icon} 
                  alt={widget.name}
                  className="w-8 h-8"
                />
              ) : (
                <div className="w-8 h-8 bg-purple-500 rounded" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                  {widget.name}
                </h3>
                {widget.featured && (
                  <div className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                    Featured
                  </div>
                )}
                {widget.trending && (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-white/50">
                <User className="w-3 h-3" />
                <span className="truncate">{widget.author.name}</span>
                {widget.author.verified && (
                  <Shield className="w-3 h-3 text-blue-400" />
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className={`font-semibold ${
                widget.price.type === 'free' ? 'text-green-400' : 'text-white'
              }`}>
                {formatPrice(widget)}
              </div>
              {widget.price.type === 'freemium' && (
                <div className="text-xs text-purple-400">Freemium</div>
              )}
            </div>
          </div>

          {/* Screenshot */}
          {widget.screenshots.length > 0 && (
            <div className="mb-3 rounded-lg overflow-hidden bg-white/5">
              <img
                src={widget.screenshots[0]}
                alt={`${widget.name} screenshot`}
                className="w-full h-32 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-white/70 mb-3 line-clamp-2">
            {widget.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {widget.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 text-white/60 text-xs rounded"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {widget.tags.length > 3 && (
              <span className="text-xs text-white/40">
                +{widget.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-white/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>{widget.rating.average.toFixed(1)}</span>
                <span>({widget.rating.count})</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>{formatDownloads(widget.downloadCount)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{getTimeAgo(widget.updatedAt)}</span>
            </div>
          </div>

          {/* License */}
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">License: {widget.license}</span>
              <span className="text-white/40">v{widget.version}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};