import { LucideIcon } from 'lucide-react';

// Interface for widget configuration field definitions
export interface WidgetConfigField {
  type: 'text' | 'number' | 'boolean' | 'select' | 'color';
  label: string;
  description?: string;
  default?: any;
  options?: { label: string; value: any }[]; // For select type
  min?: number; // For number type
  max?: number; // For number type
}

export interface Widget {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
  enabled: boolean;
  isFullscreen?: boolean;
  isResizing?: boolean;
  savedState?: {
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
}

export interface WidgetProps {
  widget: Widget;
  onUpdate: (id: string, updates: Partial<Widget>) => void;
  onRemove: (id: string) => void;
  onResize?: (id: string, size: { width: number; height: number }) => void;
  onToggleFullscreen?: (id: string) => void;
}

export interface WidgetConfig {
  type: string;
  name: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
  component: React.ComponentType<WidgetProps>;
  icon: LucideIcon;
  description: string;
  features?: {
    resizable?: boolean;
    fullscreenable?: boolean;
    hasSettings?: boolean;
    configurable?: boolean; // New feature flag for configuration
  };
  configFields?: Record<string, WidgetConfigField>; // Configuration field definitions
  version: string;
  categories?: string[];
  author?: {
    name: string;
    email?: string;
    url?: string;
  };
  license?: string;
  repository?: string;
  dependencies?: Record<string, string>;
}

// Base widget component interface for consistent sizing
export interface BaseWidgetProps extends WidgetProps {
  className?: string;
}

// Widget manifest for the marketplace
export interface WidgetManifest extends Omit<WidgetConfig, 'component' | 'icon'> {
  id: string; // Unique identifier in the marketplace
  downloads?: number;
  rating?: number;
  lastUpdated?: string;
  screenshots?: string[];
  categories?: string[];
  tags?: string[];
}

export type ColorScheme = {
  name: string;
  from: string;
  via: string;
  to: string;
  accentColor: string;
};

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  purple: {
    name: 'Purple Dream',
    from: 'from-slate-900',
    via: 'via-purple-900',
    to: 'to-slate-900',
    accentColor: 'purple'
  },
  blue: {
    name: 'Ocean Depths',
    from: 'from-slate-900',
    via: 'via-blue-900',
    to: 'to-slate-900',
    accentColor: 'blue'
  },
  green: {
    name: 'Forest Night',
    from: 'from-slate-900',
    via: 'via-green-900',
    to: 'to-slate-900',
    accentColor: 'green'
  },
  rose: {
    name: 'Sunset Glow',
    from: 'from-slate-900',
    via: 'via-rose-900',
    to: 'to-slate-900',
    accentColor: 'rose'
  },
  amber: {
    name: 'Golden Hour',
    from: 'from-slate-900',
    via: 'via-amber-900',
    to: 'to-slate-900',
    accentColor: 'amber'
  }
};

export interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
  createdAt: number;
  updatedAt: number;
  colorScheme: string;
}