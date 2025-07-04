import { supabase } from '../lib/supabase';
import { Dashboard } from '../types/widget';
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';

export interface LocalStorageData {
  dashboards?: Dashboard[];
  currentDashboardId?: string;
  settings?: AppSettings;
}

export const detectLocalStorageData = (): LocalStorageData => {
  const data: LocalStorageData = {};

  try {
    // Check for dashboards
    const dashboardsJson = localStorage.getItem('dashboards');
    if (dashboardsJson) {
      data.dashboards = JSON.parse(dashboardsJson);
    }

    // Check for current dashboard ID
    const currentDashboardId = localStorage.getItem('current-dashboard-id');
    if (currentDashboardId) {
      data.currentDashboardId = JSON.parse(currentDashboardId);
    }

    // Check for app settings
    const settingsJson = localStorage.getItem('app-settings');
    if (settingsJson) {
      data.settings = JSON.parse(settingsJson);
    }
  } catch (error) {
    console.error('Error reading localStorage data:', error);
  }

  return data;
};

export const migrateDataToSupabase = async (userId: string, localData: LocalStorageData) => {
  try {
    const results = {
      dashboards: 0,
      settings: false,
      errors: [] as string[]
    };

    // Migrate dashboards
    if (localData.dashboards && localData.dashboards.length > 0) {
      for (const dashboard of localData.dashboards) {
        try {
          const { error } = await supabase
            .from('dashboards')
            .insert({
              user_id: userId,
              name: dashboard.name,
              widgets: dashboard.widgets as any,
              color_scheme: dashboard.colorScheme || 'purple',
              locked: dashboard.locked || false,
              is_public: dashboard.isPublic || false,
              created_at: new Date(dashboard.createdAt).toISOString(),
              updated_at: new Date(dashboard.updatedAt).toISOString()
            });

          if (error) {
            console.error('Error migrating dashboard:', dashboard.name, error);
            results.errors.push(`Failed to migrate dashboard "${dashboard.name}": ${error.message}`);
          } else {
            results.dashboards++;
          }
        } catch (err) {
          console.error('Error migrating dashboard:', dashboard.name, err);
          results.errors.push(`Failed to migrate dashboard "${dashboard.name}"`);
        }
      }
    }

    // Migrate settings
    if (localData.settings) {
      try {
        const { error } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            settings: localData.settings as any
          });

        if (error) {
          console.error('Error migrating settings:', error);
          results.errors.push(`Failed to migrate settings: ${error.message}`);
        } else {
          results.settings = true;
        }
      } catch (err) {
        console.error('Error migrating settings:', err);
        results.errors.push('Failed to migrate settings');
      }
    }

    return results;
  } catch (error) {
    console.error('Error during migration:', error);
    throw new Error('Migration failed');
  }
};

export const createMigrationBackup = (localData: LocalStorageData): string => {
  const backup = {
    timestamp: new Date().toISOString(),
    data: localData
  };
  
  return JSON.stringify(backup, null, 2);
};

export const clearLocalStorageData = () => {
  try {
    localStorage.removeItem('dashboards');
    localStorage.removeItem('current-dashboard-id');
    localStorage.removeItem('app-settings');
    console.log('Local storage data cleared successfully');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const resetLocalStorage = () => {
  try {
    // Get all localStorage keys before clearing
    const allKeys = Object.keys(localStorage);
    let clearedKeys: string[] = [];
    
    // Clear main application data
    const mainKeys = [
      'dashboards',
      'current-dashboard-id',
      'app-settings',
      'settings',
      'storage-config',
      'cloud-mode-prompted',
      'local-data-backup'
    ];
    
    mainKeys.forEach(key => {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        clearedKeys.push(key);
      }
    });
    
    // Clear widget-specific data (keys that start with 'widget-')
    allKeys.forEach(key => {
      if (key.startsWith('widget-')) {
        localStorage.removeItem(key);
        clearedKeys.push(key);
      }
    });
    
    console.log('🗑️ Local storage completely reset');
    console.log('📋 Cleared keys:', clearedKeys);
    
    if (clearedKeys.length > 0) {
      alert(`Local storage reset successfully!\n\nCleared ${clearedKeys.length} items:\n${clearedKeys.join(', ')}\n\nThe page will reload to apply changes.`);
      
      // Reload the page to ensure all contexts and components reset
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      alert('Local storage was already empty.');
    }
    
    return { success: true, clearedKeys };
  } catch (error) {
    console.error('Error resetting localStorage:', error);
    alert('Error resetting local storage: ' + (error instanceof Error ? error.message : 'Unknown error'));
    return { success: false, error };
  }
};

export const showMigrationDialog = (migrationResults: any, localData: LocalStorageData): boolean => {
  const hasData = (localData.dashboards && localData.dashboards.length > 0) || localData.settings;
  
  if (!hasData) {
    return false; // No data to migrate
  }

  const { dashboards, settings, errors } = migrationResults;
  
  let message = 'Migration completed!\n\n';
  
  if (dashboards > 0) {
    message += `✅ Migrated ${dashboards} dashboard${dashboards > 1 ? 's' : ''}\n`;
  }
  
  if (settings) {
    message += `✅ Migrated app settings\n`;
  }
  
  if (errors.length > 0) {
    message += `\n⚠️ Some items couldn't be migrated:\n${errors.join('\n')}\n`;
  }
  
  message += '\nYour local data has been safely backed up and will be cleared from your browser.';
  
  const shouldContinue = confirm(message + '\n\nWould you like to clear the local data now?');
  
  if (shouldContinue) {
    // Create backup before clearing
    const backup = createMigrationBackup(localData);
    
    // Download backup file
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `widget-board-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Clear localStorage
    clearLocalStorageData();
  }
  
  return true; // Migration was attempted
};

export const performMigration = async (userId: string) => {
  try {
    // Detect local data
    const localData = detectLocalStorageData();
    
    // Check if there's anything to migrate
    const hasData = (localData.dashboards && localData.dashboards.length > 0) || localData.settings;
    
    if (!hasData) {
      return { migrated: false, message: 'No local data found to migrate' };
    }

    // Migrate data
    const migrationResults = await migrateDataToSupabase(userId, localData);
    
    // Show results and offer to clear local data
    const migrationShown = showMigrationDialog(migrationResults, localData);
    
    return {
      migrated: true,
      results: migrationResults,
      localData,
      shown: migrationShown
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      migrated: false,
      error: error instanceof Error ? error.message : 'Migration failed'
    };
  }
}; 