import React, { useState, useMemo } from 'react';
import { WIDGET_REGISTRY, WIDGET_CATEGORIES } from '../widgets';
import { Plus, X, Maximize2, ArrowUpDown, Settings, Search } from 'lucide-react';

interface WidgetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: string) => void;
  registry?: typeof WIDGET_REGISTRY;
}

export const WidgetSelector: React.FC<WidgetSelectorProps> = ({
  isOpen,
  onClose,
  onAddWidget,
  registry = WIDGET_REGISTRY
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredWidgets = useMemo(() => {
    return Object.values(registry).filter((config) => {
      const matchesSearch = 
        config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        !selectedCategory || 
        config.categories?.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, registry]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-lg border border-white/20 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="sticky top-0 z-20 bg-slate-800/90 backdrop-blur-lg">
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Add Widget</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-4 space-y-4 border-b border-white/10">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-white/50" />
              </div>
              <input
                type="text"
                placeholder="Search widgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10'
                } border`}
              >
                All
              </button>
              {Object.entries(WIDGET_CATEGORIES).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(name)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === name
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10'
                  } border`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Widget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredWidgets.map((config) => (
                <button
                  key={config.type}
                  onClick={() => {
                    onAddWidget(config.type);
                    onClose();
                  }}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 hover:scale-[1.02] text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                      <config.icon className="text-purple-400" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white mb-1">{config.name}</h3>
                      <p className="text-sm text-white/70 line-clamp-2">{config.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <div className="text-xs text-white/50 flex items-center gap-1">
                          <div className="px-1.5 py-0.5 bg-white/5 rounded">
                            {config.defaultSize.width} × {config.defaultSize.height}
                          </div>
                          {config.features?.resizable && (
                            <div className="p-1 bg-white/5 rounded" title="Resizable">
                              <ArrowUpDown size={12} className="text-purple-400" />
                            </div>
                          )}
                          {config.features?.fullscreenable && (
                            <div className="p-1 bg-white/5 rounded" title="Fullscreen Support">
                              <Maximize2 size={12} className="text-purple-400" />
                            </div>
                          )}
                          {config.features?.hasSettings && (
                            <div className="p-1 bg-white/5 rounded" title="Configurable">
                              <Settings size={12} className="text-purple-400" />
                            </div>
                          )}
                        </div>
                        <div 
                          className={`text-xs px-2 py-0.5 rounded ${
                            config.type.startsWith('custom-')
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {config.type.startsWith('custom-') ? 'Custom' : 'Base'}
                        </div>
                        {config.categories?.map((category) => (
                          <div
                            key={category}
                            className="text-xs px-2 py-0.5 bg-white/5 rounded text-white/50"
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};