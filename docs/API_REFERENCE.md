# API Reference

Complete API reference for Widget Board's internal APIs, hooks, contexts, and utilities.

## 📚 Table of Contents

- [Core Types](#core-types)
- [React Hooks](#react-hooks)
- [Contexts](#contexts)
- [Widget Utilities](#widget-utilities)
- [Storage APIs](#storage-apis)
- [Notification System](#notification-system)
- [Settings Management](#settings-management)

## 🔧 Core Types

### Widget Interfaces

#### `Widget`
```typescript
interface Widget {
  id: string;                    // Unique widget identifier
  type: string;                  // Widget type matching config.type
  title: string;                 // Display title
  position: { x: number; y: number };  // Position on dashboard
  size: { width: number; height: number };  // Current size in pixels
  config: Record<string, any>;   // User configuration data
  enabled: boolean;              // Whether widget is active
  isFullscreen?: boolean;        // Fullscreen state
  isResizing?: boolean;          // Currently being resized
  savedState?: {                 // Saved state for fullscreen toggle
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
}
```

#### `WidgetProps`
```typescript
interface WidgetProps {
  widget: Widget;                // Current widget instance
  onUpdate: (id: string, updates: Partial<Widget>) => void;  // Update function
  onRemove: (id: string) => void;                            // Remove function
  onResize?: (id: string, size: { width: number; height: number }) => void;
  onToggleFullscreen?: (id: string) => void;
}
```

#### `WidgetConfig`
```typescript
interface WidgetConfig {
  type: string;                  // Unique widget type identifier
  name: string;                  // Display name
  description: string;           // Widget description
  version: string;               // Widget version
  component: React.ComponentType<WidgetProps>;  // React component
  icon: LucideIcon;             // Icon from lucide-react
  defaultSize: { width: number; height: number };  // Default size in pixels
  minSize: { width: number; height: number };      // Minimum size
  maxSize: { width: number; height: number };      // Maximum size
  singleton?: boolean;           // Allow only one instance
  features?: WidgetFeatures;     // Feature configuration
  configFields?: Record<string, WidgetConfigField>;  // Configuration schema
  categories?: string[];         // Organization categories
  tags?: string[];              // Search tags
  author?: {                    // Author information
    name: string;
    email?: string;
    url?: string;
  };
  license?: string;             // License information
  repository?: string;          // Source repository
  dependencies?: Record<string, string>;  // External dependencies
}
```

#### `WidgetFeatures`
```typescript
interface WidgetFeatures {
  resizable?: boolean;          // Enable widget resizing (default: true)
  fullscreenable?: boolean;     // Enable fullscreen mode (default: true)
  configurable?: boolean;       // Enable configuration dialog (default: true)
  showChrome?: boolean;         // Show widget container (default: true)
  needsAuth?: string[];         // Required authentication services
  contentDrivenHeight?: boolean; // Height follows content (default: false)
  notifications?: {             // Notification capabilities
    sound?: boolean | string;   // Sound notifications
    desktop?: boolean;          // Desktop notifications
    toast?: boolean;            // Toast notifications
  };
}
```

#### `WidgetConfigField`
```typescript
interface WidgetConfigField {
  type: 'text' | 'number' | 'boolean' | 'select' | 'authKey' | 'textarea' | 'color';
  label: string;                // Display label
  description?: string;         // Help text
  defaultValue?: any;           // Default value
  required?: boolean;           // Whether field is required
  placeholder?: string;         // Placeholder text (text/textarea)
  rows?: number;               // Rows for textarea
  options?: { label: string; value: any }[];  // Options for select
  min?: number;                // Minimum value (number)
  max?: number;                // Maximum value (number)
  service?: string;            // Service name for authKey type
}
```

### Dashboard Types

#### `Dashboard`
```typescript
interface Dashboard {
  id: string;                   // Unique dashboard identifier
  name: string;                 // Display name
  widgets: Widget[];            // Widgets on this dashboard
  createdAt: number;           // Creation timestamp
  updatedAt: number;           // Last update timestamp
  colorScheme: string;         // Color scheme key
  locked?: boolean;            // Whether dashboard is locked
}
```

#### `ColorScheme`
```typescript
interface ColorScheme {
  name: string;                 // Display name
  from: string;                // Tailwind gradient from class
  via: string;                 // Tailwind gradient via class
  to: string;                  // Tailwind gradient to class
  accentColor: string;         // Base accent color name
  accent: {                    // HSL values for dynamic theming
    h: number;                 // Hue (0-360)
    s: number;                 // Saturation (0-100)
    l: number;                 // Lightness (0-100)
  };
}
```

### Settings Types

#### `AppSettings`
```typescript
interface AppSettings {
  general: {
    enableAnimations: boolean;   // Enable UI animations
    showWidgetGrid: boolean;     // Show alignment grid
  };
  appearance: {
    theme: string;              // Application theme
    defaultWidgetSize: 'compact' | 'normal' | 'large';
    showTabBar: boolean;        // Show dashboard tabs
    widgetSpacing: number;      // Spacing between widgets
  };
  performance: {
    reduceMotion: boolean;      // Reduce motion for accessibility
    hardwareAcceleration: boolean;  // Use hardware acceleration
  };
  auth: {
    keys: AuthKey[];           // Stored authentication keys
  };
}
```

#### `AuthKey`
```typescript
interface AuthKey {
  id: string;                  // Unique key identifier
  name: string;                // Display name
  key: string;                 // Encrypted key value
  service: string;             // Service identifier
  createdAt: number;           // Creation timestamp
}
```

## 🪝 React Hooks

### `useDashboards()`

Manages dashboard state and operations.

```typescript
function useDashboards(): {
  dashboards: Dashboard[];                    // All dashboards
  currentDashboard: Dashboard;               // Currently active dashboard
  scheme: ColorScheme;                       // Current color scheme
  setCurrentDashboardId: (id: string) => void;
  handlePositionChange: (id: string, position: { x: number; y: number }) => void;
  handleSizeChange: (id: string, size: { width: number; height: number }) => void;
  handleToggleFullscreen: (id: string) => void;
  handleRemoveWidget: (id: string) => void;
  handleUpdateWidget: (id: string, updates: Partial<Widget>) => void;
  handleAddWidget: (type: string) => void;
  handleDashboardAdd: () => void;
  handleDashboardRename: (dashboard: Dashboard, newName: string) => void;
  handleDashboardDelete: (dashboard: Dashboard) => void;
  handleColorSchemeChange: (scheme: string) => void;
  handleCloseAllTabs: () => void;
  handleCloseTabsToRight: (dashboard: Dashboard) => void;
  handleToggleTabLock: (dashboard: Dashboard) => void;
}
```

#### Example Usage
```typescript
const {
  currentDashboard,
  handleAddWidget,
  handleUpdateWidget,
  handleColorSchemeChange
} = useDashboards();

// Add a new widget
const addWeatherWidget = () => {
  handleAddWidget('weather');
};

// Update widget configuration
const updateWidget = (widgetId: string, config: any) => {
  const widget = currentDashboard.widgets.find(w => w.id === widgetId);
  if (widget) {
    handleUpdateWidget(widgetId, {
      ...widget,
      config: { ...widget.config, ...config }
    });
  }
};
```

### `useLocalStorage()`

Provides persistent local storage with TypeScript support.

```typescript
function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  }
): [T, React.Dispatch<React.SetStateAction<T>>];
```

#### Example Usage
```typescript
const [settings, setSettings] = useLocalStorage('app-settings', {
  theme: 'dark',
  notifications: true
});

// Update settings
setSettings(prev => ({
  ...prev,
  theme: 'light'
}));
```

### `useAuthKeys()`

Manages authentication keys for external services.

```typescript
function useAuthKeys(): {
  keys: AuthKey[];                           // All stored keys
  getKeyForService: (service: string) => string | null;  // Get key by service
  addKey: (service: string, name: string, key: string) => void;
  updateKey: (id: string, updates: Partial<AuthKey>) => void;
  removeKey: (id: string) => void;
  hasKeyForService: (service: string) => boolean;
}
```

#### Example Usage
```typescript
const { getKeyForService, addKey, hasKeyForService } = useAuthKeys();

// Check if service has key
if (!hasKeyForService('openweather')) {
  console.log('OpenWeather API key not configured');
}

// Get key for API call
const apiKey = getKeyForService('openweather');
if (apiKey) {
  // Make API call with key
}

// Add new key
addKey('github', 'GitHub Personal Token', 'ghp_xxxxx');
```

### `useWidgetNotifications()`

Provides notification capabilities for widgets.

```typescript
function useWidgetNotifications(config: WidgetConfig): {
  sendNotification: (
    message: string,
    options?: {
      type?: 'info' | 'success' | 'warning' | 'error';
      duration?: number;
      soundOptions?: {
        url?: string;
        volume?: number;
      };
    }
  ) => void;
}
```

#### Example Usage
```typescript
const { sendNotification } = useWidgetNotifications(widgetConfig);

// Send success notification
sendNotification('Data updated successfully!', {
  type: 'success',
  duration: 3000
});

// Send notification with custom sound
sendNotification('Timer finished!', {
  type: 'info',
  soundOptions: {
    url: '/sounds/timer-end.mp3',
    volume: 0.8
  }
});
```

### `useApplySettings()`

Applies theme and visual settings to the DOM.

```typescript
function useApplySettings(colorScheme: ColorScheme): void;
```

#### Example Usage
```typescript
const { scheme } = useDashboards();
useApplySettings(scheme);  // Automatically applies CSS variables
```

## 🎯 Contexts

### `SettingsContext`

Provides global settings management.

```typescript
interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

function useSettings(): SettingsContextType;
```

#### Example Usage
```typescript
const { settings, updateSettings } = useSettings();

// Update general settings
updateSettings({
  general: {
    ...settings.general,
    enableAnimations: false
  }
});
```

### `NotificationContext`

Manages the global notification system.

```typescript
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

function useNotifications(): NotificationContextType;
```

#### Example Usage
```typescript
const { addNotification, removeNotification } = useNotifications();

// Add notification
addNotification({
  type: 'success',
  message: 'Widget added successfully',
  duration: 5000
});
```

## 🛠️ Widget Utilities

### Widget Registry

#### `WIDGET_REGISTRY`
```typescript
const WIDGET_REGISTRY: Record<string, WidgetConfig>;
```

Global registry of all available widgets.

#### `initializeWidgets()`
```typescript
async function initializeWidgets(): Promise<typeof WIDGET_REGISTRY>;
```

Dynamically loads and registers all widgets from the widgets directory.

#### `registerWidget()`
```typescript
function registerWidget(config: WidgetConfig): void;
```

Manually register a widget configuration.

### Widget Helpers

#### `generateWidgetId()`
```typescript
function generateWidgetId(): string;
```

Generates a unique identifier for new widgets.

#### `validateWidgetConfig()`
```typescript
function validateWidgetConfig(config: WidgetConfig): boolean;
```

Validates a widget configuration object.

#### `getDefaultWidgetConfig()`
```typescript
function getDefaultWidgetConfig(type: string): Record<string, any>;
```

Gets the default configuration for a widget type.

## 💾 Storage APIs

### Dashboard Storage

#### `saveDashboards()`
```typescript
function saveDashboards(dashboards: Dashboard[]): void;
```

Persists dashboards to local storage.

#### `loadDashboards()`
```typescript
function loadDashboards(): Dashboard[];
```

Loads dashboards from local storage.

#### `exportDashboards()`
```typescript
function exportDashboards(dashboards: Dashboard[]): string;
```

Exports dashboards as JSON string.

#### `importDashboards()`
```typescript
function importDashboards(data: string): Dashboard[];
```

Imports dashboards from JSON string.

### Settings Storage

#### `saveSettings()`
```typescript
function saveSettings(settings: AppSettings): void;
```

Persists settings to local storage.

#### `loadSettings()`
```typescript
function loadSettings(): AppSettings;
```

Loads settings from local storage with defaults.

### Authentication Storage

#### `saveAuthKeys()`
```typescript
function saveAuthKeys(keys: AuthKey[]): void;
```

Securely stores authentication keys.

#### `loadAuthKeys()`
```typescript
function loadAuthKeys(): AuthKey[];
```

Loads authentication keys from secure storage.

## 🔔 Notification System

### Notification Types

#### `NotificationOptions`
```typescript
interface NotificationOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;         // Duration in milliseconds
  soundOptions?: {
    url?: string;           // Custom sound URL
    volume?: number;        // Volume (0-1)
  };
}
```

### Sound Management

#### `playNotificationSound()`
```typescript
function playNotificationSound(
  url?: string,
  volume?: number
): Promise<void>;
```

Plays a notification sound with caching.

#### `preloadSound()`
```typescript
function preloadSound(url: string): Promise<HTMLAudioElement>;
```

Preloads an audio file for faster playback.

### Desktop Notifications

#### `requestNotificationPermission()`
```typescript
function requestNotificationPermission(): Promise<NotificationPermission>;
```

Requests permission for desktop notifications.

#### `showDesktopNotification()`
```typescript
function showDesktopNotification(
  title: string,
  options?: NotificationOptions
): void;
```

Shows a desktop notification if permitted.

## ⚙️ Settings Management

### Theme Management

#### `COLOR_SCHEMES`
```typescript
const COLOR_SCHEMES: Record<string, ColorScheme>;
```

Available color schemes for dashboards.

#### `applyColorScheme()`
```typescript
function applyColorScheme(scheme: ColorScheme): void;
```

Applies a color scheme to the DOM via CSS variables.

#### `getContrastColor()`
```typescript
function getContrastColor(color: string): 'light' | 'dark';
```

Determines if a color needs light or dark contrast.

### Performance Utilities

#### `debounce()`
```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void;
```

Debounces function calls for performance.

#### `throttle()`
```typescript
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void;
```

Throttles function calls for performance.

### Utility Functions

#### `clamp()`
```typescript
function clamp(value: number, min: number, max: number): number;
```

Clamps a value between min and max.

#### `deepMerge()`
```typescript
function deepMerge<T>(target: T, source: Partial<T>): T;
```

Deeply merges two objects.

#### `generateId()`
```typescript
function generateId(prefix?: string): string;
```

Generates a unique identifier with optional prefix.

---

## 🔗 External Dependencies

### Required Libraries

- **React** 18.3.1+ - Core framework
- **Lucide React** - Icon library
- **Lodash** - Utility functions
- **UUID** - Unique identifier generation

### Optional Libraries

- **React Markdown** - Markdown rendering in widgets
- **React Transition Group** - Animation utilities

---

**This API reference is automatically generated from TypeScript definitions.**

*For the most up-to-date information, refer to the source code and TypeScript definitions.* 