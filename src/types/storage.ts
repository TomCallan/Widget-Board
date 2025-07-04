export type StorageMode = 'local' | 'cloud';

export interface StorageConfig {
  mode: StorageMode;
  autoSync: boolean; // Whether to auto-sync when switching to cloud mode
  lastSync?: string; // Last sync timestamp
}

export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  mode: 'local',
  autoSync: true
}; 