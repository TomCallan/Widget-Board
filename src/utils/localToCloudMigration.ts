import { Dashboard } from '../types/widget';
import { AppSettings } from '../types/settings';
import { supabase } from '../lib/supabase';

export async function migrateDashboardsToCloud(): Promise<boolean> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get local dashboards
    const localDashboards = localStorage.getItem('dashboards');
    if (!localDashboards) {
      console.log('No local dashboards to migrate');
      return true;
    }

    const dashboards: Dashboard[] = JSON.parse(localDashboards);
    
    // Check if user already has cloud dashboards
    const { data: existingDashboards } = await supabase
      .from('dashboards')
      .select('id')
      .eq('user_id', user.id);

    if (existingDashboards && existingDashboards.length > 0) {
      const confirmOverwrite = confirm(
        'You already have cloud dashboards. Do you want to merge your local dashboards with your cloud dashboards? ' +
        'This will not delete your existing cloud dashboards.'
      );
      
      if (!confirmOverwrite) {
        return false;
      }
    }

    // Migrate each dashboard
    for (const dashboard of dashboards) {
      const { error } = await supabase
        .from('dashboards')
        .insert({
          user_id: user.id,
          name: `${dashboard.name} (Local)`,
          widgets: dashboard.widgets as any, // Cast to Json type
          color_scheme: dashboard.colorScheme || 'purple',
          locked: dashboard.locked || false,
          is_public: false
        });

      if (error) {
        console.error(`Error migrating dashboard ${dashboard.name}:`, error);
      }
    }

    // Create backup of local data before clearing
    const backupData = {
      dashboards: dashboards,
      timestamp: new Date().toISOString(),
      migrated: true
    };
    localStorage.setItem('local-data-backup', JSON.stringify(backupData));

    console.log('Dashboards successfully migrated to cloud');
    return true;
  } catch (error) {
    console.error('Error migrating dashboards to cloud:', error);
    return false;
  }
}

export async function migrateSettingsToCloud(): Promise<boolean> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get local settings
    const localSettings = localStorage.getItem('settings');
    if (!localSettings) {
      console.log('No local settings to migrate');
      return true;
    }

    const settings: AppSettings = JSON.parse(localSettings);

    // Check if user already has cloud settings
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingSettings) {
      const confirmOverwrite = confirm(
        'You already have cloud settings. Do you want to overwrite them with your local settings?'
      );
      
      if (!confirmOverwrite) {
        return false;
      }

      // Update existing settings
      const { error } = await supabase
        .from('user_settings')
        .update({
          settings: settings as any // Cast to Json type
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating cloud settings:', error);
        return false;
      }
    } else {
      // Create new settings
      const { error } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          settings: settings as any // Cast to Json type
        });

      if (error) {
        console.error('Error creating cloud settings:', error);
        return false;
      }
    }

    console.log('Settings successfully migrated to cloud');
    return true;
  } catch (error) {
    console.error('Error migrating settings to cloud:', error);
    return false;
  }
}

export async function performFullMigration(): Promise<boolean> {
  const dashboardsMigrated = await migrateDashboardsToCloud();
  const settingsMigrated = await migrateSettingsToCloud();
  
  return dashboardsMigrated && settingsMigrated;
} 