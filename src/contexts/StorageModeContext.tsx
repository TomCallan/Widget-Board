import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageMode, StorageConfig, DEFAULT_STORAGE_CONFIG } from '../types/storage';
import { useAuth } from './AuthContext';
import { performFullMigration } from '../utils/localToCloudMigration';

interface StorageModeContextType {
  storageMode: StorageMode;
  storageConfig: StorageConfig;
  isCloudConfigured: boolean;
  isCloudAvailable: boolean;
  switchToLocal: () => void;
  switchToCloud: () => Promise<void>;
  updateStorageConfig: (config: Partial<StorageConfig>) => void;
}

const StorageModeContext = createContext<StorageModeContextType | undefined>(undefined);

export function StorageModeProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [storageConfig, setStorageConfig] = useState<StorageConfig>(DEFAULT_STORAGE_CONFIG);

  // Check if cloud storage is configured (don't require user auth to show option)
  const isCloudConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  
  // Cloud is available only when configured, user is signed in, and auth is not loading
  const isCloudAvailable = isCloudConfigured && !!user && !authLoading;

  // Load storage config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('storage-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setStorageConfig({ ...DEFAULT_STORAGE_CONFIG, ...config });
      } catch (error) {
        console.error('Error loading storage config:', error);
      }
    } else {
      // If no saved config, use smart defaults based on current state
      const smartDefault = {
        ...DEFAULT_STORAGE_CONFIG,
        // Start with local mode until we know if user is signed in
        mode: 'local' as StorageMode
      };
      setStorageConfig(smartDefault);
    }
  }, []);

  // Smart mode switching when auth state is known
  useEffect(() => {
    if (!authLoading && isCloudConfigured) {
      const hasExplicitConfig = localStorage.getItem('storage-config');
      
      // If user just signed in and we don't have an explicit storage preference, offer cloud mode
      if (user && !hasExplicitConfig && storageConfig.mode === 'local') {
        const hasPrompted = localStorage.getItem('cloud-mode-prompted');
        if (!hasPrompted) {
          setTimeout(() => {
            const shouldSwitch = confirm(
              '🎉 You\'re now signed in! Would you like to use Cloud Storage to enable:\n' +
              '• Real-time sync across devices\n' +
              '• Dashboard sharing features\n' +
              '• Automatic backups\n\n' +
              'Your local data will be migrated safely.'
            );
            
            if (shouldSwitch) {
              switchToCloud().catch(error => {
                console.error('Failed to switch to cloud:', error);
              });
            } else {
              // If they chose local, save that preference
              const newConfig = { 
                ...storageConfig, 
                mode: 'local' as StorageMode
              };
              saveStorageConfig(newConfig);
            }
            localStorage.setItem('cloud-mode-prompted', 'true');
          }, 1000);
        }
      }
    }
  }, [authLoading, user, isCloudConfigured, storageConfig.mode]);

  // Auto-switch to local mode only when user explicitly signs out (not during loading)
  useEffect(() => {
    if (!isCloudAvailable && storageConfig.mode === 'cloud' && !authLoading && user === null) {
      console.log('User signed out, switching to local mode');
      switchToLocal();
    }
  }, [isCloudAvailable, storageConfig.mode, authLoading, user]);

  // Clear the prompt flag when user signs out so they get prompted again on next sign-in
  useEffect(() => {
    if (!user && !authLoading) {
      localStorage.removeItem('cloud-mode-prompted');
    }
  }, [user, authLoading]);

  const saveStorageConfig = (config: StorageConfig) => {
    setStorageConfig(config);
    localStorage.setItem('storage-config', JSON.stringify(config));
  };

  const switchToLocal = () => {
    const newConfig = { ...storageConfig, mode: 'local' as StorageMode };
    saveStorageConfig(newConfig);
  };

  const switchToCloud = async () => {
    if (!isCloudConfigured) {
      throw new Error('Cloud storage is not configured. Please check your environment variables.');
    }

    // If user is not authenticated, save the preference and let the UI handle sign-in
    if (!user) {
      const newConfig = { 
        ...storageConfig, 
        mode: 'cloud' as StorageMode
      };
      saveStorageConfig(newConfig);
      throw new Error('REQUIRES_AUTH'); // Special error code for UI to handle
    }

    // Check if there's local data to migrate
    const hasLocalDashboards = localStorage.getItem('dashboards');
    const hasLocalSettings = localStorage.getItem('settings');
    
    if ((hasLocalDashboards || hasLocalSettings) && storageConfig.autoSync) {
      const shouldMigrate = confirm(
        'You have local data that can be migrated to the cloud. ' +
        'Do you want to migrate your dashboards and settings to sync with cloud storage?'
      );
      
      if (shouldMigrate) {
        const migrationSuccess = await performFullMigration();
        if (!migrationSuccess) {
          throw new Error('Migration failed. Please try again or contact support.');
        }
      }
    }

    const newConfig = { 
      ...storageConfig, 
      mode: 'cloud' as StorageMode,
      lastSync: new Date().toISOString()
    };
    saveStorageConfig(newConfig);
  };

  const updateStorageConfig = (updates: Partial<StorageConfig>) => {
    const newConfig = { ...storageConfig, ...updates };
    saveStorageConfig(newConfig);
  };

  const value: StorageModeContextType = {
    storageMode: storageConfig.mode,
    storageConfig,
    isCloudConfigured,
    isCloudAvailable,
    switchToLocal,
    switchToCloud,
    updateStorageConfig
  };

  return (
    <StorageModeContext.Provider value={value}>
      {children}
    </StorageModeContext.Provider>
  );
}

export function useStorageMode() {
  const context = useContext(StorageModeContext);
  if (context === undefined) {
    throw new Error('useStorageMode must be used within a StorageModeProvider');
  }
  return context;
} 