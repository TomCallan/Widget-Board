import React from 'react';
import { Widget, WidgetConfig, WidgetConfigField } from '../types/widget';
import { X } from 'lucide-react';

interface WidgetConfigDialogProps {
  widget: Widget;
  widgetConfig: WidgetConfig;
  onClose: () => void;
  onSave: (id: string, config: Record<string, any>) => void;
}

export const WidgetConfigDialog: React.FC<WidgetConfigDialogProps> = ({
  widget,
  widgetConfig,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = React.useState({ ...widget.config });

  const handleSave = () => {
    onSave(widget.id, config);
    onClose();
  };

  const renderField = (key: string, field: WidgetConfigField) => {
    const value = config[key] ?? field.default;

    switch (field.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={key}
              checked={value}
              onChange={(e) => setConfig({ ...config, [key]: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
            />
            <label htmlFor={key} className="text-sm text-white/70">
              {field.label}
            </label>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-1">
            <label htmlFor={key} className="block text-sm text-white/70">
              {field.label}
            </label>
            <select
              id={key}
              value={value}
              onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
              className="w-full rounded bg-white/10 border-white/20 text-white focus:ring-purple-500 focus:border-purple-500"
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-1">
            <label htmlFor={key} className="block text-sm text-white/70">
              {field.label}
            </label>
            <input
              type="number"
              id={key}
              value={value}
              min={field.min}
              max={field.max}
              onChange={(e) => setConfig({ ...config, [key]: Number(e.target.value) })}
              className="w-full rounded bg-white/10 border-white/20 text-white focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        );

      case 'color':
        return (
          <div className="space-y-1">
            <label htmlFor={key} className="block text-sm text-white/70">
              {field.label}
            </label>
            <input
              type="color"
              id={key}
              value={value}
              onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
              className="w-full h-8 rounded bg-white/10 border-white/20"
            />
          </div>
        );

      default: // text
        return (
          <div className="space-y-1">
            <label htmlFor={key} className="block text-sm text-white/70">
              {field.label}
            </label>
            <input
              type="text"
              id={key}
              value={value}
              onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
              className="w-full rounded bg-white/10 border-white/20 text-white focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">
            Configure {widgetConfig.name}
          </h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {widgetConfig.configFields && Object.entries(widgetConfig.configFields).map(([key, field]) => (
            <div key={key} className="space-y-1">
              {renderField(key, field)}
              {field.description && (
                <p className="text-xs text-white/50">{field.description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}; 