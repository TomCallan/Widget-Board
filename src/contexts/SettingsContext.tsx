import React, { createContext, useContext } from 'react';
import { AppSettings, AuthKey } from '../types/settings';
import { useUnifiedSettings } from '../hooks/useUnifiedSettings';

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  error: string | null;
  updateGeneralSettings: (settings: Partial<AppSettings['general']>) => Promise<void>;
  updateAppearanceSettings: (settings: Partial<AppSettings['appearance']>) => Promise<void>;
  updatePerformanceSettings: (settings: Partial<AppSettings['performance']>) => Promise<void>;
  addAuthKey: (key: Omit<AuthKey, 'id' | 'createdAt'>) => Promise<void>;
  removeAuthKey: (id: string) => Promise<void>;
  updateAuthKey: (id: string, updates: Partial<Omit<AuthKey, 'id' | 'createdAt'>>) => Promise<void>;
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
  const {
    settings,
    loading,
    error,
    updateGeneralSettings,
    updateAppearanceSettings,
    updatePerformanceSettings,
    addAuthKey,
    removeAuthKey,
    updateAuthKey,
  } = useUnifiedSettings();

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
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