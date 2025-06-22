export interface Widget {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
  enabled: boolean;
}

export interface WidgetProps {
  widget: Widget;
  onUpdate: (id: string, updates: Partial<Widget>) => void;
  onRemove: (id: string) => void;
}

export interface WidgetConfig {
  type: string;
  name: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
  component: React.ComponentType<WidgetProps>;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

// Base widget component interface for consistent sizing
export interface BaseWidgetProps extends WidgetProps {
  className?: string;
}