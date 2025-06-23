import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Widget, WidgetConfig } from '../types/widget';
import { AuthKeySelect } from './AuthKeySelect';

interface WidgetConfigDialogProps {
  widget: Widget;
  config: WidgetConfig;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Widget>) => void;
}

export const WidgetConfigDialog: React.FC<WidgetConfigDialogProps> = ({
  widget,
  config,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(widget.config || {});

  useEffect(() => {
    // Set default values for any unset fields
    if (config.configFields) {
      const defaults: Record<string, any> = {};
      Object.entries(config.configFields).forEach(([key, field]) => {
        if (formData[key] === undefined && field.defaultValue !== undefined) {
          defaults[key] = field.defaultValue;
        }
      });
      if (Object.keys(defaults).length > 0) {
        setFormData(prev => ({ ...prev, ...defaults }));
      }
    }
  }, [config.configFields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(widget.id, { config: formData });
    onClose();
  };

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (!config.configFields) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-800/90 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Configure {widget.title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(config.configFields).map(([key, field]) => (
            <div key={key}>
              <label className="block text-white mb-2">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              
              {field.description && (
                <p className="text-sm text-white/50 mb-2">{field.description}</p>
              )}

              {field.type === 'text' && (
                <input
                  type="text"
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required={field.required}
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value ? Number(e.target.value) : '')}
                  min={field.min}
                  max={field.max}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required={field.required}
                />
              )}

              {field.type === 'boolean' && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData[key] || false}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    className="form-checkbox h-4 w-4 text-purple-500 rounded border-white/20 bg-white/5 focus:ring-purple-500"
                  />
                  <span className="text-white/70">{field.label}</span>
                </label>
              )}

              {field.type === 'select' && field.options && (
                <select
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required={field.required}
                >
                  {!field.required && <option value="">Select an option</option>}
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'authKey' && (
                <AuthKeySelect
                  value={formData[key] || ''}
                  onChange={(value) => handleChange(key, value)}
                  service={field.service}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 