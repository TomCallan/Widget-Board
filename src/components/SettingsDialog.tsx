import React, { useState } from 'react';
import { Plus, Key, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { Dialog } from './common/Dialog';
import { AuthKey } from '../types/settings';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      size="2xl"
    >
      <div className="space-y-6">
        {/* Auth Keys */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium text-lg">API Key Management</h3>
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
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {settings.auth.keys.length > 0 ? (
              settings.auth.keys.map((authKey: AuthKey) => (
                <div key={authKey.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{authKey.name}</div>
                    <div className="text-sm text-white/50">{authKey.service}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-mono text-sm text-white/70">
                      {visibleKeys.includes(authKey.id) ? authKey.key : '•'.repeat(16)}
                    </div>
                    <button onClick={() => toggleKeyVisibility(authKey.id)} className="text-white/50 hover:text-white">
                      {visibleKeys.includes(authKey.id) ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button onClick={() => removeAuthKey(authKey.id)} className="text-red-500 hover:text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              !showNewKeyForm && (
                <div className="text-center py-8 text-white/50">
                  You haven't added any API keys yet.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}; 