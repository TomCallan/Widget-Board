import React, { useState } from 'react';
import { MarketplaceWidget } from '../../types/marketplace';
import { 
  ArrowLeft, Star, Download, Shield, ExternalLink, 
  Heart, Share2, Flag, DollarSign, Calendar, 
  Package, Globe, Book, Play, User, MessageSquare,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface WidgetDetailsProps {
  widget: MarketplaceWidget;
  onBack: () => void;
  onInstall: (widget: MarketplaceWidget) => void;
}

export const WidgetDetails: React.FC<WidgetDetailsProps> = ({
  widget,
  onBack,
  onInstall
}) => {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const formatPrice = () => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSize = (sizeKB: number) => {
    if (sizeKB >= 1024) {
      return `${(sizeKB / 1024).toFixed(1)} MB`;
    }
    return `${sizeKB} KB`;
  };

  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => 
      prev === widget.screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => 
      prev === 0 ? widget.screenshots.length - 1 : prev - 1
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-white/20'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-xl font-semibold text-white">Widget Details</h2>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Screenshots and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Screenshots */}
          {widget.screenshots.length > 0 && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-white/5">
                <img
                  src={widget.screenshots[currentScreenshot]}
                  alt={`${widget.name} screenshot ${currentScreenshot + 1}`}
                  className="w-full h-64 object-cover"
                />
                {widget.screenshots.length > 1 && (
                  <>
                    <button
                      onClick={prevScreenshot}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={nextScreenshot}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  </>
                )}
              </div>
              
              {widget.screenshots.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {widget.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentScreenshot(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                        index === currentScreenshot 
                          ? 'border-purple-500' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Description</h3>
            <p className="text-white/70 leading-relaxed">
              {widget.longDescription || widget.description}
            </p>
          </div>

          {/* Features */}
          {widget.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Features</h3>
              <ul className="space-y-2">
                {widget.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Reviews</h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Write Review
              </button>
            </div>

            {/* Rating Summary */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {widget.rating.average.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {renderStars(widget.rating.average)}
                  </div>
                  <div className="text-sm text-white/50">
                    {widget.rating.count} reviews
                  </div>
                </div>
                
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm text-white/70 w-8">{stars}★</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{
                            width: `${(widget.rating.breakdown[stars as keyof typeof widget.rating.breakdown] / widget.rating.count) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-white/50 w-8">
                        {widget.rating.breakdown[stars as keyof typeof widget.rating.breakdown]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {widget.reviews.slice(0, showAllReviews ? undefined : 3).map((review) => (
                <div key={review.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">{review.userName}</span>
                        {review.verified && (
                          <Shield className="w-4 h-4 text-blue-400" />
                        )}
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-white/50">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <h4 className="font-medium text-white mb-1">{review.title}</h4>
                      <p className="text-white/70 text-sm">{review.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="text-sm text-white/50 hover:text-white">
                          👍 Helpful ({review.helpful})
                        </button>
                        <button className="text-sm text-white/50 hover:text-white">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {widget.reviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full py-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showAllReviews ? 'Show Less' : `Show All ${widget.reviews.length} Reviews`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Widget Info and Actions */}
        <div className="space-y-6">
          {/* Widget Header */}
          <div className="bg-white/5 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                {widget.icon ? (
                  <img 
                    src={widget.icon} 
                    alt={widget.name}
                    className="w-12 h-12"
                  />
                ) : (
                  <div className="w-12 h-12 bg-purple-500 rounded" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-xl font-bold text-white">{widget.name}</h1>
                  {widget.featured && (
                    <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-white/50" />
                  <span className="text-white/70">{widget.author.name}</span>
                  {widget.author.verified && (
                    <Shield className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <div className="flex items-center gap-1">
                    {renderStars(widget.rating.average)}
                    <span>({widget.rating.count})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{formatDownloads(widget.downloadCount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price and Install */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`text-2xl font-bold ${
                  widget.price.type === 'free' ? 'text-green-400' : 'text-white'
                }`}>
                  {formatPrice()}
                </div>
                {widget.price.type === 'freemium' && (
                  <div className="text-sm text-purple-400">
                    Premium features available
                  </div>
                )}
              </div>
              
              <button
                onClick={() => onInstall(widget)}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
              >
                {widget.price.type === 'free' ? 'Install Free' : 'Purchase & Install'}
              </button>
              
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Widget Information */}
          <div className="bg-white/5 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Information</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Version</span>
                <span className="text-white">{widget.version}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-white/50">Category</span>
                <span className="text-white">{widget.category}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-white/50">Size</span>
                <span className="text-white">{formatSize(widget.size.bundleSize)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-white/50">License</span>
                <span className="text-white">{widget.license}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-white/50">Updated</span>
                <span className="text-white">{formatDate(widget.updatedAt)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-white/50">Created</span>
                <span className="text-white">{formatDate(widget.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {widget.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-white/10 text-white/70 text-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="bg-white/5 rounded-lg p-6 space-y-3">
            <h3 className="text-lg font-semibold text-white">Links</h3>
            
            {widget.repository && (
              <a
                href={widget.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Package className="w-4 h-4" />
                Source Code
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            
            {widget.documentation && (
              <a
                href={widget.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Book className="w-4 h-4" />
                Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            
            {widget.demo && (
              <a
                href={widget.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Play className="w-4 h-4" />
                Live Demo
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Dependencies */}
          {widget.size.dependencies.length > 0 && (
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Dependencies</h3>
              <div className="space-y-2">
                {widget.size.dependencies.map((dep) => (
                  <div key={dep} className="text-sm text-white/70 font-mono">
                    {dep}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};