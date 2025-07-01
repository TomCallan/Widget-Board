import React, { useState } from 'react';
import { Plus, Key, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { Dialog } from './common/Dialog';
import { Tabs } from './common/Tabs';

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

  const settingsTabs = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'performance', label: 'Performance' },
    { id: 'auth', label: 'Auth' },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      size="2xl"
    >
      <div>
        <Tabs
          tabs={settingsTabs}
          activeTab={activeTab}
          onTabClick={(tabId) => setActiveTab(tabId as SettingsTab)}
        />

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
                    className="form-checkbox h-4 w-4 text-accent-500 rounded border-white/20 bg-white/5 focus:ring-accent-500"
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
                    className="form-checkbox h-4 w-4 text-accent-500 rounded border-white/20 bg-white/5 focus:ring-accent-500"
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
                <label className="flex items-center justify-between">
                  <span className="text-white">Show Dashboard Tabs</span>
                  <input
                    type="checkbox"
                    checked={settings.appearance.showTabBar}
                    onChange={(e) => updateAppearanceSettings({ showTabBar: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-accent-500 rounded border-white/20 bg-white/5 focus:ring-accent-500"
                  />
                </label>
                <p className="text-sm text-white/50 mt-1">
                  Show or hide the dashboard tabs bar
                </p>
              </div>

              <div>
                <label className="block text-white mb-2">Default Widget Size</label>
                <select
                  value={settings.appearance.defaultWidgetSize}
                  onChange={(e) => updateAppearanceSettings({ 
                    defaultWidgetSize: e.target.value as 'compact' | 'normal' | 'large' 
                  })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
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
                    className="form-checkbox h-4 w-4 text-accent-500 rounded border-white/20 bg-white/5 focus:ring-accent-500"
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
                    className="form-checkbox h-4 w-4 text-accent-500 rounded border-white/20 bg-white/5 focus:ring-accent-500"
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
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
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
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Service</label>
                    <input
                      type="text"
                      value={newAuthKey.service}
                      onChange={(e) => setNewAuthKey(prev => ({ ...prev, service: e.target.value }))}
                      placeholder="e.g., OpenAI"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">API Key</label>
                    <input
                      type="password"
                      value={newAuthKey.key}
                      onChange={(e) => setNewAuthKey(prev => ({ ...prev, key: e.target.value }))}
                      placeholder="Enter your API key"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowNewKeyForm(false);
                        setNewAuthKey({ name: '', service: '', key: '' });
                      }}
                      className="px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAuthKey}
                      className="px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {settings.auth.keys.length === 0 && !showNewKeyForm && (
                  <p className="text-center text-white/50 py-4">No API keys added yet.</p>
                )}
                {settings.auth.keys.map((authKey) => (
                  <div key={authKey.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key size={16} className="text-white/50" />
                      <div>
                        <p className="font-medium text-white">{authKey.name}</p>
                        <p className="text-sm text-white/50">{authKey.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white/50 font-mono">
                        {visibleKeys.includes(authKey.id) ? authKey.key : '••••••••••••'}
                      </p>
                      <button onClick={() => toggleKeyVisibility(authKey.id)} className="p-1.5 text-white/70 hover:text-white rounded-lg transition-colors">
                        {visibleKeys.includes(authKey.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button onClick={() => removeAuthKey(authKey.id)} className="p-1.5 text-red-400 hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
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
    </Dialog>
  );
}; 