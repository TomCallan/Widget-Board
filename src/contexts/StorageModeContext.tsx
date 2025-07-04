import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageMode, StorageConfig, DEFAULT_STORAGE_CONFIG } from '../types/storage';
import { useAuth } from './AuthContext';
import { performFullMigration } from '../utils/localToCloudMigration';

interface StorageModeContextType {
  storageMode: StorageMode;
  storageConfig: StorageConfig;
  isCloudAvailable: boolean;
  switchToLocal: () => void;
  switchToCloud: () => Promise<void>;
  updateStorageConfig: (config: Partial<StorageConfig>) => void;
}

const StorageModeContext = createContext<StorageModeContextType | undefined>(undefined);

export function StorageModeProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [storageConfig, setStorageConfig] = useState<StorageConfig>(DEFAULT_STORAGE_CONFIG);

  // Check if cloud storage is available (Supabase configured and user authenticated)
  const isCloudAvailable = !authLoading && !!user && 
    !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

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
    }
  }, []);

  // Auto-switch to local mode if cloud becomes unavailable
  useEffect(() => {
    if (!isCloudAvailable && storageConfig.mode === 'cloud') {
      console.log('Cloud storage unavailable, switching to local mode');
      switchToLocal();
    }
  }, [isCloudAvailable, storageConfig.mode]);

  const saveStorageConfig = (config: StorageConfig) => {
    setStorageConfig(config);
    localStorage.setItem('storage-config', JSON.stringify(config));
  };

  const switchToLocal = () => {
    const newConfig = { ...storageConfig, mode: 'local' as StorageMode };
    saveStorageConfig(newConfig);
  };

  const switchToCloud = async () => {
    if (!isCloudAvailable) {
      throw new Error('Cloud storage is not available. Please sign in and ensure Supabase is configured.');
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