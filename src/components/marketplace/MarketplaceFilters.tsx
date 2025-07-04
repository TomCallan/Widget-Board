import React from 'react';
import { MarketplaceFilters } from '../../types/marketplace';
import { X, DollarSign, Star, Tag, User } from 'lucide-react';

interface MarketplaceFiltersProps {
  filters: MarketplaceFilters;
  onFiltersChange: (filters: MarketplaceFilters) => void;
  availableCategories: string[];
  availableTags: string[];
}

export const MarketplaceFiltersComponent: React.FC<MarketplaceFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags
}) => {
  const updateFilter = (key: keyof MarketplaceFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({ sortBy: filters.sortBy });
  };

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.priceRange ||
    filters.rating ||
    filters.tags?.length ||
    filters.author ||
    filters.priceType
  );

  return (
    <div className="bg-white/5 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-white/70 hover:text-white"
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value || undefined)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" className="bg-gray-800">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category} className="bg-gray-800">
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Type Filter */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <DollarSign className="inline w-4 h-4 mr-1" />
            Price Type
          </label>
          <select
            value={filters.priceType || ''}
            onChange={(e) => updateFilter('priceType', e.target.value || undefined)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" className="bg-gray-800">All Types</option>
            <option value="free" className="bg-gray-800">Free</option>
            <option value="paid" className="bg-gray-800">Paid</option>
            <option value="freemium" className="bg-gray-800">Freemium</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Star className="inline w-4 h-4 mr-1" />
            Minimum Rating
          </label>
          <select
            value={filters.rating || ''}
            onChange={(e) => updateFilter('rating', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" className="bg-gray-800">Any Rating</option>
            <option value="4" className="bg-gray-800">4+ Stars</option>
            <option value="4.5" className="bg-gray-800">4.5+ Stars</option>
            <option value="5" className="bg-gray-800">5 Stars</option>
          </select>
        </div>

        {/* Author Filter */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <User className="inline w-4 h-4 mr-1" />
            Author
          </label>
          <input
            type="text"
            value={filters.author || ''}
            onChange={(e) => updateFilter('author', e.target.value || undefined)}
            placeholder="Search authors..."
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Price Range */}
      {filters.priceType !== 'free' && (
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Price Range ($)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={filters.priceRange?.min || ''}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                min: e.target.value ? Number(e.target.value) : 0
              })}
              placeholder="Min"
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-white/50">to</span>
            <input
              type="number"
              value={filters.priceRange?.max || ''}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                max: e.target.value ? Number(e.target.value) : 1000
              })}
              placeholder="Max"
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

      {/* Tags Filter */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          <Tag className="inline w-4 h-4 mr-1" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {availableTags.slice(0, 20).map((tag) => {
            const isSelected = filters.tags?.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => {
                  const currentTags = filters.tags || [];
                  const newTags = isSelected
                    ? currentTags.filter(t => t !== tag)
                    : [...currentTags, tag];
                  updateFilter('tags', newTags.length > 0 ? newTags : undefined);
                }}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  isSelected
                    ? 'bg-purple-500/30 text-purple-400 border border-purple-500/50'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/20'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};