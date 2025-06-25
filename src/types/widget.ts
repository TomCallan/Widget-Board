import { LucideIcon } from 'lucide-react';

// Interface for widget configuration field definitions
export interface WidgetConfigField {
  type: 'text' | 'number' | 'boolean' | 'select' | 'authKey' | 'textarea' | 'color';
  label: string;
  description?: string;
  defaultValue?: any;
  required?: boolean;
  placeholder?: string;
  rows?: number; // for textarea
  options?: { label: string; value: any }[]; // For select type
  min?: number; // For number type
  max?: number; // For number type
  service?: string; // For authKey type, specify which service's keys to show
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
  onToggleFullscreen?: (id: string) => void;
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
  singleton?: boolean; // Allow only one instance of this widget
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
  component: React.ComponentType<WidgetProps>;
  icon: LucideIcon;
  description: string;
  features?: {
    resizable?: boolean;
    fullscreenable?: boolean;
    configurable?: boolean;
    showChrome?: boolean; // Show/hide the widget container header
    needsAuth?: string[]; // List of auth services required
    contentDrivenHeight?: boolean; // Widget height is determined by its content
    notifications?: {
      sound?: boolean | string; // Can be true for default behavior or a URL string
      desktop?: boolean;
      toast?: boolean;
    };
  };
  configFields?: Record<string, WidgetConfigField>;
  version: string;
  categories?: string[];
  tags?: string[];
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
  accent: {
    h: number;
    s: number;
    l: number;
  };
};

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  purple: {
    name: 'Purple Dream',
    from: 'from-slate-900',
    via: 'via-purple-900',
    to: 'to-slate-900',
    accentColor: 'purple',
    accent: { h: 267, s: 90, l: 65 },
  },
  blue: {
    name: 'Ocean Depths',
    from: 'from-slate-900',
    via: 'via-blue-900',
    to: 'to-slate-900',
    accentColor: 'blue',
    accent: { h: 217, s: 91, l: 60 },
  },
  green: {
    name: 'Forest Night',
    from: 'from-slate-900',
    via: 'via-green-900',
    to: 'to-slate-900',
    accentColor: 'green',
    accent: { h: 142, s: 71, l: 45 },
  },
  rose: {
    name: 'Sunset Glow',
    from: 'from-slate-900',
    via: 'via-rose-900',
    to: 'to-slate-900',
    accentColor: 'rose',
    accent: { h: 336, s: 88, l: 60 },
  },
  amber: {
    name: 'Golden Hour',
    from: 'from-slate-900',
    via: 'via-amber-900',
    to: 'to-slate-900',
    accentColor: 'amber',
    accent: { h: 36, s: 93, l: 50 },
  }
};

export interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
  createdAt: number;
  updatedAt: number;
  colorScheme: string;
  locked?: boolean;
}