import React, { useState } from 'react';
import { Plus, Key, Eye, EyeOff, Trash2, User, LogOut, Crown, Database, RotateCcw } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { Dialog } from './common/Dialog';
import { AuthKey } from '../types/settings';
import { resetLocalStorage } from '../utils/dataMigration';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose
}) => {
  const { user, isFreeTier, isPremiumTier, dashboardLimit, signOut } = useAuth();
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
        {/* User Profile */}
        {user && (
          <div className="space-y-4">
            <h3 className="text-white font-medium text-lg flex items-center gap-2">
              <User size={20} />
              Profile
            </h3>
            
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={24} className="text-white/60" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium">{user.full_name || user.username}</h4>
                    {isPremiumTier() && (
                      <Crown size={16} className="text-yellow-400" />
                    )}
                  </div>
                  <p className="text-white/60 text-sm">@{user.username}</p>
                  <p className="text-white/60 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                <div>
                  <div className="text-white/60 text-xs">Tier</div>
                  <div className={`text-sm font-medium ${
                    isPremiumTier() ? 'text-yellow-400' : 'text-blue-400'
                  }`}>
                    {isPremiumTier() ? 'Premium' : 'Free'}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 text-xs">Dashboard Limit</div>
                  <div className="text-white/80 text-sm">
                    {dashboardLimit === Infinity ? 'Unlimited' : dashboardLimit}
                  </div>
                </div>
              </div>
              
              {isFreeTier() && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-blue-400 text-sm">
                  <p className="font-medium mb-1">Free Tier Benefits:</p>
                  <ul className="text-xs space-y-0.5">
                    <li>• Up to 3 dashboards</li>
                    <li>• All available widgets</li>
                    <li>• Basic sharing features</li>
                  </ul>
                </div>
              )}
              
              <button
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}

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

        {/* Data Management */}
        <div className="space-y-4">
          <h3 className="text-white font-medium text-lg flex items-center gap-2">
            <Database size={20} />
            Data Management
          </h3>
          
          <div className="bg-white/5 rounded-lg p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-white font-medium">Reset Local Storage</h4>
              <p className="text-white/60 text-sm">
                Clear all locally stored data including dashboards, settings, and widget configurations. 
                This action cannot be undone.
              </p>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-yellow-400 text-sm">
                <p className="font-medium mb-1">⚠️ Warning:</p>
                <ul className="text-xs space-y-0.5">
                  <li>• All local dashboards will be deleted</li>
                  <li>• All widget data will be lost</li>
                  <li>• App settings will be reset to defaults</li>
                  <li>• The page will reload after reset</li>
                </ul>
              </div>
              
              <button
                onClick={() => {
                  const confirm = window.confirm(
                    '🚨 Are you sure you want to reset ALL local storage?\n\n' +
                    'This will permanently delete:\n' +
                    '• All your dashboards\n' +
                    '• All widget configurations\n' +
                    '• All app settings\n' +
                    '• All API keys\n\n' +
                    'This action CANNOT be undone!'
                  );
                  
                  if (confirm) {
                    resetLocalStorage();
                  }
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <RotateCcw size={16} />
                Reset Local Storage
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}; 