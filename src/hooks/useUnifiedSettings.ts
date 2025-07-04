import { useStorageMode } from '../contexts/StorageModeContext';
import { useLocalStorage } from './useLocalStorage';
import { useSupabaseSettings } from './useSupabaseSettings';
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';

export function useUnifiedSettings() {
  const { storageMode } = useStorageMode();
  const [localSettings, setLocalSettings] = useLocalStorage<AppSettings>('settings', DEFAULT_SETTINGS);
  const cloudHook = useSupabaseSettings();

  if (storageMode === 'cloud') {
    return cloudHook;
  } else {
    // For local mode, provide the same interface as the cloud hook
    const updateGeneralSettings = async (updates: Partial<AppSettings['general']>) => {
      setLocalSettings(prev => ({
        ...prev,
        general: { ...prev.general, ...updates }
      }));
    };

    const updateAppearanceSettings = async (updates: Partial<AppSettings['appearance']>) => {
      setLocalSettings(prev => ({
        ...prev,
        appearance: { ...prev.appearance, ...updates }
      }));
    };

    const updatePerformanceSettings = async (updates: Partial<AppSettings['performance']>) => {
      setLocalSettings(prev => ({
        ...prev,
        performance: { ...prev.performance, ...updates }
      }));
    };

    const addAuthKey = async (key: Omit<import('../types/settings').AuthKey, 'id' | 'createdAt'>) => {
      const newKey = {
        ...key,
        id: Date.now().toString(),
        createdAt: Date.now()
      };
      setLocalSettings(prev => ({
        ...prev,
        auth: {
          ...prev.auth,
          keys: [...prev.auth.keys, newKey]
        }
      }));
    };

    const removeAuthKey = async (id: string) => {
      setLocalSettings(prev => ({
        ...prev,
        auth: {
          ...prev.auth,
          keys: prev.auth.keys.filter(key => key.id !== id)
        }
      }));
    };

    const updateAuthKey = async (id: string, updates: Partial<Omit<import('../types/settings').AuthKey, 'id' | 'createdAt'>>) => {
      setLocalSettings(prev => ({
        ...prev,
        auth: {
          ...prev.auth,
          keys: prev.auth.keys.map(key => 
            key.id === id ? { ...key, ...updates } : key
          )
        }
      }));
    };

    return {
      settings: localSettings,
      loading: false,
      error: null,
      updateGeneralSettings,
      updateAppearanceSettings,
      updatePerformanceSettings,
      addAuthKey,
      removeAuthKey,
      updateAuthKey
    };
  }
} 