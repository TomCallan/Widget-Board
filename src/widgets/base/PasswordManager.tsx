import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Key, Copy, Trash2, Eye, EyeOff, Plus, RefreshCw, Save } from 'lucide-react';

interface PasswordConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

interface SavedPassword {
  id: string;
  label: string;
  password: string;
  createdAt: string;
}

interface WidgetState {
  config: PasswordConfig;
  savedPasswords: SavedPassword[];
}

const PasswordGeneratorWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const defaultConfig = {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false
  };

  const defaultState = {
    savedPasswords: []
  };

  // Initialize config with defaults if not set
  const config = {
    ...defaultConfig,
    ...widget.config?.config,
  };

  const savedPasswords = widget.config?.savedPasswords || defaultState.savedPasswords;

  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordLabel, setPasswordLabel] = useState('');
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const updateConfig = (updates: Partial<PasswordConfig>) => {
    onUpdate(widget.id, {
      config: {
        config: { ...config, ...updates },
        savedPasswords
      }
    });
  };

  const updateSavedPasswords = (newSavedPasswords: SavedPassword[]) => {
    onUpdate(widget.id, {
      config: {
        config,
        savedPasswords: newSavedPasswords
      }
    });
  };

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const ambiguous = '0O1lI|`';

    let charset = '';
    if (config.includeUppercase) charset += uppercase;
    if (config.includeLowercase) charset += lowercase;
    if (config.includeNumbers) charset += numbers;
    if (config.includeSymbols) charset += symbols;

    if (config.excludeAmbiguous) {
      charset = charset.split('').filter(char => !ambiguous.includes(char)).join('');
    }

    if (charset === '') {
      setCurrentPassword('Please select at least one character type');
      return;
    }

    let password = '';
    for (let i = 0; i < config.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setCurrentPassword(password);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const savePassword = () => {
    if (!currentPassword || !passwordLabel) return;

    const newPassword: SavedPassword = {
      id: Date.now().toString(),
      label: passwordLabel,
      password: currentPassword,
      createdAt: new Date().toISOString()
    };

    updateSavedPasswords([...savedPasswords, newPassword]);

    setPasswordLabel('');
  };

  const deletePassword = (id: string) => {
    updateSavedPasswords(savedPasswords.filter((p: SavedPassword) => p.id !== id));
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    // Only generate on mount or when password generation settings change
    const configString = JSON.stringify(config);
    generatePassword();
  }, [JSON.stringify(config)]); // Using JSON.stringify to create a stable dependency

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { strength: 'Medium', color: 'bg-yellow-500' };
    return { strength: 'Strong', color: 'bg-green-500' };
  };

  const strength = currentPassword ? getPasswordStrength(currentPassword) : null;

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Password Generator Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Key size={18} />
          Password Generator
        </h3>

        {/* Generated Password Display */}
        <div className="bg-white/5 p-3 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                readOnly
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white font-mono text-sm"
                placeholder="Click generate to create password"
              />
            </div>
            <button
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={() => copyToClipboard(currentPassword)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              disabled={!currentPassword}
            >
              <Copy size={16} />
            </button>
            <button
              onClick={generatePassword}
              className="p-2 hover:bg-white/10 rounded transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          {strength && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/70">Strength:</span>
              <div className={`px-2 py-1 rounded text-xs ${strength.color}`}>
                {strength.strength}
              </div>
            </div>
          )}
        </div>

        {/* Password Configuration */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <label className="block text-white/70 mb-1">Length: {config.length}</label>
            <input
              type="range"
              min="4"
              max="128"
              value={config.length}
              onChange={(e) => updateConfig({ length: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            {[
              { key: 'includeUppercase', label: 'A-Z' },
              { key: 'includeLowercase', label: 'a-z' },
              { key: 'includeNumbers', label: '0-9' },
              { key: 'includeSymbols', label: '!@#' }
            ].map(option => (
              <label key={option.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config[option.key as keyof PasswordConfig] as boolean}
                  onChange={(e) => updateConfig({ [option.key]: e.target.checked })}
                  className="rounded"
                />
                <span className="text-white/70">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={config.excludeAmbiguous}
            onChange={(e) => updateConfig({ excludeAmbiguous: e.target.checked })}
            className="rounded"
          />
          <span className="text-white/70">Exclude ambiguous characters (0, O, 1, l, I, |)</span>
        </label>
      </div>

      {/* Save Password Section */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Label for this password..."
            value={passwordLabel}
            onChange={(e) => setPasswordLabel(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
          />
          <button
            onClick={savePassword}
            disabled={!currentPassword || !passwordLabel}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded text-white text-sm flex items-center gap-1"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>

      {/* Saved Passwords Section */}
      {savedPasswords.length > 0 && (
        <div className="space-y-2 flex-1 overflow-hidden">
          <h4 className="text-sm font-medium text-white/90">Saved Passwords</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {savedPasswords.map((savedPassword: SavedPassword) => (
              <div key={savedPassword.id} className="bg-white/5 p-2 rounded flex items-center gap-2 text-sm">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white/90 truncate">{savedPassword.label}</div>
                  <div className="text-white/60 text-xs">
                    {new Date(savedPassword.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <input
                  type={showPasswords[savedPassword.id] ? 'text' : 'password'}
                  value={savedPassword.password}
                  readOnly
                  className="w-24 bg-white/10 border border-white/20 rounded px-2 py-1 text-xs font-mono"
                />
                <button
                  onClick={() => togglePasswordVisibility(savedPassword.id)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {showPasswords[savedPassword.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
                <button
                  onClick={() => copyToClipboard(savedPassword.password)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Copy size={12} />
                </button>
                <button
                  onClick={() => deletePassword(savedPassword.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const passwordGeneratorConfig: WidgetConfig = {
  type: 'custom-password-generator',
  name: 'Password Generator',
  description: 'Generate secure random passwords and manage saved passwords',
  defaultSize: { width: 400, height: 500 },
  minSize: { width: 300, height: 400 },
  maxSize: { width: 600, height: 800 },
  component: PasswordGeneratorWidget,
  icon: Key,
  version: '1.0.0',
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: false
  },
  categories: ['TOOLS', 'PRODUCTIVITY'],
  author: {
    name: 'Dash',
    email: 'support@dash.com'
  }
};