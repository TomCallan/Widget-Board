import { useState, useEffect, useCallback } from 'react';
import { AppSettings, DEFAULT_SETTINGS, AuthKey } from '../types/settings';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useSupabaseSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from Supabase
  useEffect(() => {
    if (!user) {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('user_settings')
          .select('settings')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
          throw fetchError;
        }

        if (data && data.settings) {
          // Merge with defaults to handle new settings fields
          const userSettings = data.settings as Partial<AppSettings>;
          setSettings({
            ...DEFAULT_SETTINGS,
            ...userSettings,
            general: { ...DEFAULT_SETTINGS.general, ...userSettings.general },
            appearance: { ...DEFAULT_SETTINGS.appearance, ...userSettings.appearance },
            performance: { ...DEFAULT_SETTINGS.performance, ...userSettings.performance },
            auth: { ...DEFAULT_SETTINGS.auth, ...userSettings.auth }
          });
        } else {
          // No settings found, create default settings
          await saveSettingsToSupabase(DEFAULT_SETTINGS);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load settings');
        setSettings(DEFAULT_SETTINGS); // Fallback to defaults
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const saveSettingsToSupabase = async (newSettings: AppSettings) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          settings: newSettings as any,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(newSettings);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    }
  };

  const updateGeneralSettings = useCallback(async (updates: Partial<AppSettings['general']>) => {
    const newSettings = {
      ...settings,
      general: {
        ...settings.general,
        ...updates,
      },
    };
    await saveSettingsToSupabase(newSettings);
  }, [settings, saveSettingsToSupabase]);

  const updateAppearanceSettings = useCallback(async (updates: Partial<AppSettings['appearance']>) => {
    const newSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        ...updates,
      },
    };
    await saveSettingsToSupabase(newSettings);
  }, [settings, saveSettingsToSupabase]);

  const updatePerformanceSettings = useCallback(async (updates: Partial<AppSettings['performance']>) => {
    const newSettings = {
      ...settings,
      performance: {
        ...settings.performance,
        ...updates,
      },
    };
    await saveSettingsToSupabase(newSettings);
  }, [settings, saveSettingsToSupabase]);

  const addAuthKey = useCallback(async (key: Omit<AuthKey, 'id' | 'createdAt'>) => {
    const newKey: AuthKey = {
      ...key,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const newSettings = {
      ...settings,
      auth: {
        ...settings.auth,
        keys: [...settings.auth.keys, newKey],
      },
    };
    await saveSettingsToSupabase(newSettings);
  }, [settings, saveSettingsToSupabase]);

  const removeAuthKey = useCallback(async (id: string) => {
    const newSettings = {
      ...settings,
      auth: {
        ...settings.auth,
        keys: settings.auth.keys.filter(key => key.id !== id),
      },
    };
    await saveSettingsToSupabase(newSettings);
  }, [settings, saveSettingsToSupabase]);

  const updateAuthKey = useCallback(async (id: string, updates: Partial<Omit<AuthKey, 'id' | 'createdAt'>>) => {
    const newSettings = {
      ...settings,
      auth: {
        ...settings.auth,
        keys: settings.auth.keys.map(key => 
          key.id === id ? { ...key, ...updates } : key
        ),
      },
    };
    await saveSettingsToSupabase(newSettings);
  }, [settings, saveSettingsToSupabase]);

  return {
    settings,
    loading,
    error,
    updateGeneralSettings,
    updateAppearanceSettings,
    updatePerformanceSettings,
    addAuthKey,
    removeAuthKey,
    updateAuthKey,
  };
}; 