export interface AuthKey {
  id: string;
  name: string;
  key: string;
  service: string;
  createdAt: number;
}

export interface AppearanceSettings {
  theme: string;
  defaultWidgetSize: 'compact' | 'normal' | 'large';
  showTabBar: boolean;
  widgetSpacing: number;
}

export interface AppSettings {
  general: {
    enableAnimations: boolean;
    showWidgetGrid: boolean;
  };
  appearance: AppearanceSettings;
  performance: {
    reduceMotion: boolean;
    hardwareAcceleration: boolean;
  };
  auth: {
    keys: AuthKey[];
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  general: {
    enableAnimations: true,
    showWidgetGrid: true,
  },
  appearance: {
    theme: 'default',
    defaultWidgetSize: 'normal',
    showTabBar: true,
    widgetSpacing: 16,
  },
  performance: {
    reduceMotion: false,
    hardwareAcceleration: true,
  },
  auth: {
    keys: [],
  },
}; 