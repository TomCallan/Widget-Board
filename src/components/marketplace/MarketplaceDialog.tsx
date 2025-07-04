import React, { useState, useEffect } from 'react';
import { Dialog } from '../common/Dialog';
import { MarketplaceWidget, MarketplaceFilters } from '../../types/marketplace';
import { MarketplaceGrid } from './MarketplaceGrid';
import { MarketplaceFilters as FiltersComponent } from './MarketplaceFilters';
import { WidgetDetails } from './WidgetDetails';
import { UserDashboard } from './UserDashboard';
import { SubmitWidget } from './SubmitWidget';
import { 
  Store, Search, Filter, User, Plus, TrendingUp, 
  Star, Download, Clock, DollarSign 
} from 'lucide-react';

interface MarketplaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallWidget: (widget: MarketplaceWidget) => void;
}

type MarketplaceView = 'browse' | 'details' | 'dashboard' | 'submit';

export const MarketplaceDialog: React.FC<MarketplaceDialogProps> = ({
  isOpen,
  onClose,
  onInstallWidget
}) => {
  const [currentView, setCurrentView] = useState<MarketplaceView>('browse');
  const [widgets, setWidgets] = useState<MarketplaceWidget[]>([]);
  const [filteredWidgets, setFilteredWidgets] = useState<MarketplaceWidget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<MarketplaceWidget | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MarketplaceFilters>({
    sortBy: 'popular'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setWidgets(mockMarketplaceWidgets);
        setFilteredWidgets(mockMarketplaceWidgets);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...widgets];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(widget =>
        widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(widget => widget.category === filters.category);
    }

    // Price type filter
    if (filters.priceType) {
      filtered = filtered.filter(widget => widget.price.type === filters.priceType);
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(widget => 
        widget.price.amount >= filters.priceRange!.min &&
        widget.price.amount <= filters.priceRange!.max
      );
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter(widget => widget.rating.average >= filters.rating!);
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(widget =>
        filters.tags!.some(tag => widget.tags.includes(tag))
      );
    }

    // Author filter
    if (filters.author) {
      filtered = filtered.filter(widget => 
        widget.author.name.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.average - a.rating.average);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price.amount - b.price.amount);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price.amount - a.price.amount);
        break;
      case 'trending':
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
    }

    setFilteredWidgets(filtered);
  }, [widgets, searchQuery, filters]);

  const handleWidgetSelect = (widget: MarketplaceWidget) => {
    setSelectedWidget(widget);
    setCurrentView('details');
  };

  const handleInstall = (widget: MarketplaceWidget) => {
    onInstallWidget(widget);
    onClose();
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Store className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Widget Marketplace</h2>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentView('submit')}
          className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
        >
          <Plus size={16} />
          Submit Widget
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
        >
          <User size={16} />
          Dashboard
        </button>
      </div>
    </div>
  );

  const renderBrowseView = () => (
    <>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search widgets..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              showFilters ? 'bg-purple-500/30 text-purple-400' : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-sm text-white/70">Trending</div>
            <div className="text-lg font-semibold text-white">
              {widgets.filter(w => w.trending).length}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-sm text-white/70">Top Rated</div>
            <div className="text-lg font-semibold text-white">
              {widgets.filter(w => w.rating.average >= 4.5).length}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Download className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-sm text-white/70">Free</div>
            <div className="text-lg font-semibold text-white">
              {widgets.filter(w => w.price.type === 'free').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-sm text-white/70">New</div>
            <div className="text-lg font-semibold text-white">
              {widgets.filter(w => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(w.createdAt) > weekAgo;
              }).length}
            </div>
          </div>
        </div>

        {showFilters && (
          <FiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            availableCategories={Array.from(new Set(widgets.map(w => w.category)))}
            availableTags={Array.from(new Set(widgets.flatMap(w => w.tags)))}
          />
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-white/70">
          {filteredWidgets.length} widget{filteredWidgets.length !== 1 ? 's' : ''} found
        </div>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
          className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ colorScheme: 'dark' }}
        >
          <option value="popular" className="bg-gray-800">Most Popular</option>
          <option value="newest" className="bg-gray-800">Newest</option>
          <option value="rating" className="bg-gray-800">Highest Rated</option>
          <option value="price-low" className="bg-gray-800">Price: Low to High</option>
          <option value="price-high" className="bg-gray-800">Price: High to Low</option>
          <option value="trending" className="bg-gray-800">Trending</option>
        </select>
      </div>

      <MarketplaceGrid
        widgets={filteredWidgets}
        loading={loading}
        onWidgetSelect={handleWidgetSelect}
      />
    </>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'browse':
        return renderBrowseView();
      case 'details':
        return selectedWidget ? (
          <WidgetDetails
            widget={selectedWidget}
            onBack={() => setCurrentView('browse')}
            onInstall={handleInstall}
          />
        ) : null;
      case 'dashboard':
        return (
          <UserDashboard
            onBack={() => setCurrentView('browse')}
          />
        );
      case 'submit':
        return (
          <SubmitWidget
            onBack={() => setCurrentView('browse')}
            onSubmit={(submission) => {
              // Handle widget submission
              console.log('Widget submitted:', submission);
              setCurrentView('browse');
            }}
          />
        );
      default:
        return renderBrowseView();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="2xl"
    >
      <div className="h-[80vh] flex flex-col">
        {currentView === 'browse' && renderHeader()}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </Dialog>
  );
};

// Mock data for demonstration
const mockMarketplaceWidgets: MarketplaceWidget[] = [
  {
    id: 'mp-weather-pro',
    name: 'Weather Pro',
    description: 'Advanced weather widget with forecasts and radar',
    longDescription: 'A comprehensive weather widget featuring 7-day forecasts, weather radar, severe weather alerts, and beautiful animations.',
    version: '2.1.0',
    author: {
      id: 'user-1',
      name: 'WeatherDev',
      verified: true,
      rating: 4.8,
      totalSales: 1250
    },
    category: 'Weather',
    tags: ['weather', 'forecast', 'radar', 'alerts'],
    price: {
      amount: 4.99,
      currency: 'USD',
      type: 'paid'
    },
    screenshots: [
      'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop'
    ],
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNjM2NkYxIi8+Cjwvc3ZnPgo=',
    downloadCount: 15420,
    rating: {
      average: 4.7,
      count: 892,
      breakdown: { 5: 650, 4: 180, 3: 45, 2: 12, 1: 5 }
    },
    reviews: [],
    features: ['7-day forecast', 'Weather radar', 'Severe alerts', 'Multiple locations'],
    compatibility: {
      minVersion: '1.0.0'
    },
    size: {
      bundleSize: 245,
      dependencies: ['react', 'lucide-react']
    },
    license: 'Commercial',
    repository: 'https://github.com/weatherdev/weather-pro',
    documentation: 'https://docs.weatherpro.com',
    demo: 'https://demo.weatherpro.com',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-01T14:30:00Z',
    status: 'active',
    trending: true,
    featured: true
  },
  {
    id: 'mp-crypto-tracker',
    name: 'Crypto Tracker',
    description: 'Real-time cryptocurrency price tracking',
    longDescription: 'Track your favorite cryptocurrencies with real-time prices, charts, and portfolio management.',
    version: '1.5.2',
    author: {
      id: 'user-2',
      name: 'CryptoWidgets',
      verified: true,
      rating: 4.6,
      totalSales: 890
    },
    category: 'Finance',
    tags: ['crypto', 'bitcoin', 'ethereum', 'portfolio'],
    price: {
      amount: 0,
      currency: 'USD',
      type: 'free'
    },
    screenshots: [
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop'
    ],
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY5NTAwIi8+Cjwvc3ZnPgo=',
    downloadCount: 8750,
    rating: {
      average: 4.4,
      count: 456,
      breakdown: { 5: 280, 4: 120, 3: 40, 2: 12, 1: 4 }
    },
    reviews: [],
    features: ['Real-time prices', 'Portfolio tracking', 'Price alerts', 'Charts'],
    compatibility: {
      minVersion: '1.0.0'
    },
    size: {
      bundleSize: 180,
      dependencies: ['react', 'chart.js']
    },
    license: 'MIT',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-28T16:45:00Z',
    status: 'active',
    trending: false,
    featured: false
  }
];