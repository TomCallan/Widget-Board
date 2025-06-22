import { LucideIcon } from 'lucide-react';

export interface DashboardPage {
  id: string;
  name: string;
  widgets: Widget[];
  icon?: LucideIcon;
  color?: string;
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
  };
  version: string;
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