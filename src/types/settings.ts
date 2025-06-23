export interface AuthKey {
  id: string;
  name: string;
  key: string;
  service: string;
  createdAt: number;
}

export interface AppSettings {
  general: {
    enableAnimations: boolean;
    showWidgetGrid: boolean;
  };
  appearance: {
    defaultWidgetSize: 'compact' | 'normal' | 'large';
    widgetSpacing: number;
  };
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
    defaultWidgetSize: 'normal',
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