import { WidgetConfig } from '../types/widget';

// Define widget categories
export const WIDGET_CATEGORIES = {
  TIME: 'Time & Date',
  PRODUCTIVITY: 'Productivity',
  SYSTEM: 'System',
  TOOLS: 'Tools',
  INFORMATION: 'Information'
} as const;

// Initialize registries
let BASE_WIDGETS: Record<string, WidgetConfig> = {};
let CUSTOM_WIDGETS: Record<string, WidgetConfig> = {};
let WIDGET_REGISTRY: Record<string, WidgetConfig> = {};

// Helper function to load widgets from a directory
async function loadWidgetsFromDirectory(isBase: boolean) {
  const modules = isBase 
    ? import.meta.glob('./base/*.tsx', { eager: true })
    : import.meta.glob('./custom/*.tsx', { eager: true });

  const loadedWidgets: Record<string, WidgetConfig> = {};

  for (const path in modules) {
    const module = modules[path] as Record<string, unknown>;
    
    // Skip non-widget files (like index.ts)
    if (!path.endsWith('.tsx')) continue;

    const config = Object.values(module as Record<string, unknown>).find(
        value => value && typeof value === 'object' && 'type' in value && 'component' in value
    ) as WidgetConfig | undefined;

    if (!config) {
      console.warn(`No widget config found in ${path}`);
      continue;
    }
    
    // Convert category strings to match WIDGET_CATEGORIES values
    if (config.categories) {
      config.categories = config.categories.map(category => {
        // Find the matching category from WIDGET_CATEGORIES
        const matchingCategory = Object.entries(WIDGET_CATEGORIES).find(
          ([, value]) => value === category
        );
        return matchingCategory ? matchingCategory[1] : category;
      });
    }

    loadedWidgets[config.type] = config;
  }

  return loadedWidgets;
}

// Function to initialize all widgets
export async function initializeWidgets() {
  // Load both base and custom widgets
  const [baseWidgets, customWidgets] = await Promise.all([
    loadWidgetsFromDirectory(true),
    loadWidgetsFromDirectory(false)
  ]);

  // Update the registries
  BASE_WIDGETS = baseWidgets;
  CUSTOM_WIDGETS = customWidgets;
  
  // Update the combined registry
  WIDGET_REGISTRY = {
    ...BASE_WIDGETS,
    ...CUSTOM_WIDGETS
  };

  return WIDGET_REGISTRY;
}

// Function to register a new custom widget
export function registerCustomWidget(config: WidgetConfig) {
  if (BASE_WIDGETS[config.type]) {
    throw new Error(`Widget type "${config.type}" already exists in base widgets`);
  }
  if (CUSTOM_WIDGETS[config.type]) {
    throw new Error(`Widget type "${config.type}" already exists in custom widgets`);
  }
  CUSTOM_WIDGETS[config.type] = config;
  WIDGET_REGISTRY[config.type] = config;
}

// Export the registries
export { WIDGET_REGISTRY };

// Export individual widget types for type safety
export type WidgetType = keyof typeof WIDGET_REGISTRY;

// Export categories for filtering
export type WidgetCategory = typeof WIDGET_CATEGORIES[keyof typeof WIDGET_CATEGORIES];

// Helper function to get widgets by category
export function getWidgetsByCategory(category: WidgetCategory): WidgetConfig[] {
  return Object.values(WIDGET_REGISTRY).filter(widget => 
    widget.categories?.includes(category)
  );
} 