import React, { useState } from 'react';
import { X, Plus, Key, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'general' | 'appearance' | 'performance' | 'auth';

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose
}) => {
  const {
    settings,
    updateGeneralSettings,
    updateAppearanceSettings,
    updatePerformanceSettings,
    addAuthKey,
    removeAuthKey,
    updateAuthKey,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [newAuthKey, setNewAuthKey] = useState({ name: '', service: '', key: '' });
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);

  const handleAddAuthKey = () => {
    if (newAuthKey.name && newAuthKey.service && newAuthKey.key) {
      addAuthKey(newAuthKey);
      setNewAuthKey({ name: '', service: '', key: '' });
      setShowNewKeyForm(false);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => 
      prev.includes(keyId) 
        ? prev.filter(id => id !== keyId)
        : [...prev, keyId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-800/90 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {(['general', 'appearance', 'performance', 'auth'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-purple-500 text-white'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-white">Enable Animations</span>
                  <input
                    type="checkbox"
                    checked={settings.general.enableAnimations}
                    onChange={(e) => updateGeneralSettings({ enableAnimations: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-purple-500 rounded border-white/20 bg-white/5 focus:ring-purple-500"
                  />
                </label>
                <p className="text-sm text-white/50 mt-1">
                  Toggle UI animations throughout the app
                </p>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <span className="text-white">Show Widget Grid</span>
                  <input
                    type="checkbox"
                    checked={settings.general.showWidgetGrid}
                    onChange={(e) => updateGeneralSettings({ showWidgetGrid: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-purple-500 rounded border-white/20 bg-white/5 focus:ring-purple-500"
                  />
                </label>
                <p className="text-sm text-white/50 mt-1">
                  Display alignment grid when moving widgets
                </p>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Default Widget Size</label>
                <select
                  value={settings.appearance.defaultWidgetSize}
                  onChange={(e) => updateAppearanceSettings({ 
                    defaultWidgetSize: e.target.value as 'compact' | 'normal' | 'large' 
                  })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">
                  Widget Spacing: {settings.appearance.widgetSpacing}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  step="8"
                  value={settings.appearance.widgetSpacing}
                  onChange={(e) => updateAppearanceSettings({ 
                    widgetSpacing: parseInt(e.target.value) 
                  })}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Performance Settings */}
          {activeTab === 'performance' && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-white">Reduce Motion</span>
                  <input
                    type="checkbox"
                    checked={settings.performance.reduceMotion}
                    onChange={(e) => updatePerformanceSettings({ reduceMotion: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-purple-500 rounded border-white/20 bg-white/5 focus:ring-purple-500"
                  />
                </label>
                <p className="text-sm text-white/50 mt-1">
                  Minimize animations for better performance
                </p>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <span className="text-white">Hardware Acceleration</span>
                  <input
                    type="checkbox"
                    checked={settings.performance.hardwareAcceleration}
                    onChange={(e) => updatePerformanceSettings({ hardwareAcceleration: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-purple-500 rounded border-white/20 bg-white/5 focus:ring-purple-500"
                  />
                </label>
                <p className="text-sm text-white/50 mt-1">
                  Use GPU acceleration when available
                </p>
              </div>
            </div>
          )}

          {/* Auth Keys */}
          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">API Keys</h3>
                <button
                  onClick={() => setShowNewKeyForm(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Add Key
                </button>
              </div>

              {showNewKeyForm && (
                <div className="p-4 bg-white/5 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Name</label>
                    <input
                      type="text"
                      value={newAuthKey.name}
                      onChange={(e) => setNewAuthKey(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., OpenAI API Key"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Service</label>
                    <input
                      type="text"
                      value={newAuthKey.service}
                      onChange={(e) => setNewAuthKey(prev => ({ ...prev, service: e.target.value }))}
                      placeholder="e.g., OpenAI"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">API Key</label>
                    <input
                      type="password"
                      value={newAuthKey.key}
                      onChange={(e) => setNewAuthKey(prev => ({ ...prev, key: e.target.value }))}
                      placeholder="Enter your API key"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setNewAuthKey({ name: '', service: '', key: '' });
                        setShowNewKeyForm(false);
                      }}
                      className="px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAuthKey}
                      className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {settings.auth.keys.map((key) => (
                  <div
                    key={key.id}
                    className="p-3 bg-white/5 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Key size={16} className="text-purple-400" />
                        <span className="text-white font-medium">{key.name}</span>
                      </div>
                      <div className="text-sm text-white/50 mt-1">
                        {key.service} · Added {new Date(key.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
                        title={visibleKeys.includes(key.id) ? 'Hide key' : 'Show key'}
                      >
                        {visibleKeys.includes(key.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => removeAuthKey(key.id)}
                        className="p-1.5 text-white/50 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                        title="Remove key"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {settings.auth.keys.length === 0 && !showNewKeyForm && (
                  <div className="text-center py-8 text-white/50">
                    No API keys added yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 