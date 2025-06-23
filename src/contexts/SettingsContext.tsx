import React, { createContext, useContext, useCallback } from 'react';
import { AppSettings, DEFAULT_SETTINGS, AuthKey } from '../types/settings';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsContextType {
  settings: AppSettings;
  updateGeneralSettings: (settings: Partial<AppSettings['general']>) => void;
  updateAppearanceSettings: (settings: Partial<AppSettings['appearance']>) => void;
  updatePerformanceSettings: (settings: Partial<AppSettings['performance']>) => void;
  addAuthKey: (key: Omit<AuthKey, 'id' | 'createdAt'>) => void;
  removeAuthKey: (id: string) => void;
  updateAuthKey: (id: string, updates: Partial<Omit<AuthKey, 'id' | 'createdAt'>>) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', DEFAULT_SETTINGS);

  const updateGeneralSettings = useCallback((updates: Partial<AppSettings['general']>) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        ...updates,
      },
    }));
  }, [setSettings]);

  const updateAppearanceSettings = useCallback((updates: Partial<AppSettings['appearance']>) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        ...updates,
      },
    }));
  }, [setSettings]);

  const updatePerformanceSettings = useCallback((updates: Partial<AppSettings['performance']>) => {
    setSettings(prev => ({
      ...prev,
      performance: {
        ...prev.performance,
        ...updates,
      },
    }));
  }, [setSettings]);

  const addAuthKey = useCallback((key: Omit<AuthKey, 'id' | 'createdAt'>) => {
    const newKey: AuthKey = {
      ...key,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    setSettings(prev => ({
      ...prev,
      auth: {
        ...prev.auth,
        keys: [...prev.auth.keys, newKey],
      },
    }));
  }, [setSettings]);

  const removeAuthKey = useCallback((id: string) => {
    setSettings(prev => ({
      ...prev,
      auth: {
        ...prev.auth,
        keys: prev.auth.keys.filter(key => key.id !== id),
      },
    }));
  }, [setSettings]);

  const updateAuthKey = useCallback((id: string, updates: Partial<Omit<AuthKey, 'id' | 'createdAt'>>) => {
    setSettings(prev => ({
      ...prev,
      auth: {
        ...prev.auth,
        keys: prev.auth.keys.map(key => 
          key.id === id ? { ...key, ...updates } : key
        ),
      },
    }));
  }, [setSettings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateGeneralSettings,
        updateAppearanceSettings,
        updatePerformanceSettings,
        addAuthKey,
        removeAuthKey,
        updateAuthKey,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 