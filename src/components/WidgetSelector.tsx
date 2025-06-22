import React from 'react';
import { WIDGET_REGISTRY } from '../widgets';
import { Plus, X, Maximize2, ArrowUpDown, Settings } from 'lucide-react';

interface WidgetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: string) => void;
}

export const WidgetSelector: React.FC<WidgetSelectorProps> = ({
  isOpen,
  onClose,
  onAddWidget
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-800/90 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add Widget</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(WIDGET_REGISTRY).map((config) => (
            <button
              key={config.type}
              onClick={() => {
                onAddWidget(config.type);
                onClose();
              }}
              className="p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 hover:scale-105 text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <config.icon className="text-purple-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">{config.name}</h3>
                  <p className="text-sm text-white/70">{config.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-xs text-white/50">
                      {config.defaultSize.width} × {config.defaultSize.height}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
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
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};