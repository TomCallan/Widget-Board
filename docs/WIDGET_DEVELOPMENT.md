# Widget Development Guide

Create powerful, interactive widgets for the Widget Board dashboard platform. This guide covers everything from basic widget creation to advanced features and best practices.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Widget Architecture](#widget-architecture)
- [Configuration System](#configuration-system)
- [Advanced Features](#advanced-features)
- [Styling & Theming](#styling--theming)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Your First Widget

Create a new file in `src/widgets/custom/` (for custom widgets) or `src/widgets/base/` (for core widgets):

```typescript
// src/widgets/custom/HelloWorldWidget.tsx
import React, { useState } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Heart, Settings } from 'lucide-react';

const HelloWorldWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const { message, showIcon } = widget.config;
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    // Persist the click count to widget config
    onUpdate(widget.id, {
      ...widget,
      config: { ...widget.config, clickCount: clickCount + 1 }
    });
  };

  return (
    <div className="h-full p-4 flex flex-col items-center justify-center space-y-4">
      {showIcon && <Heart className="w-8 h-8 text-accent-500" />}
      <h3 className="text-xl font-bold text-white">{message}</h3>
      <button 
        onClick={handleClick}
        className="px-4 py-2 bg-accent-600 hover:bg-accent-700 rounded-lg text-white transition-colors"
      >
        Clicked {clickCount} times
      </button>
    </div>
  );
};

export const helloWorldWidgetConfig: WidgetConfig = {
  type: 'custom-hello-world',
  name: 'Hello World',
  description: 'A friendly greeting widget with interactive features',
  version: '1.0.0',
  
  // Component & Icon
  component: HelloWorldWidget,
  icon: Heart,
  
  // Size Configuration
  defaultSize: { width: 250, height: 200 },
  minSize: { width: 200, height: 150 },
  maxSize: { width: 400, height: 300 },
  
  // Features
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: true,
    showChrome: true,
  },
  
  // Configuration Fields
  configFields: {
    message: {
      type: 'text',
      label: 'Message',
      description: 'The greeting message to display',
      defaultValue: 'Hello, World!',
      placeholder: 'Enter your message...'
    },
    showIcon: {
      type: 'boolean',
      label: 'Show Heart Icon',
      description: 'Toggle the heart icon display',
      defaultValue: true
    },
    clickCount: {
      type: 'number',
      label: 'Click Count',
      description: 'Number of times the button has been clicked',
      defaultValue: 0,
      min: 0
    }
  },
  
  // Metadata
  categories: ['Examples', 'Interactive'],
  tags: ['hello-world', 'example', 'beginner'],
  author: {
    name: 'Widget Board Team',
    email: 'widgets@widgetboard.dev'
  }
};
```

### Widget Registration

Widgets are automatically discovered and registered when placed in the widgets directory. The platform scans for exported `*WidgetConfig` objects.

## 🏗️ Widget Architecture

### Core Interfaces

#### WidgetProps
```typescript
interface WidgetProps {
  widget: Widget;                                    // Current widget instance
  onUpdate: (id: string, updates: Partial<Widget>) => void;  // Update function
  onRemove: (id: string) => void;                   // Remove function
}
```

#### Widget Instance
```typescript
interface Widget {
  id: string;                    // Unique identifier
  type: string;                  // Widget type (matches config.type)
  title: string;                 // Display title
  position: { x: number; y: number };  // Position on dashboard
  size: { width: number; height: number };  // Current size
  config: Record<string, any>;   // User configuration
  enabled: boolean;              // Whether widget is active
  isFullscreen?: boolean;        // Fullscreen state
}
```

### Widget Lifecycle

1. **Discovery** - Platform scans widget files for configs
2. **Registration** - Valid configs are added to the registry
3. **Instantiation** - User adds widget to dashboard
4. **Rendering** - Component receives props and renders
5. **Updates** - Configuration changes trigger re-renders
6. **Cleanup** - Widget removal and memory cleanup

## ⚙️ Configuration System

### Field Types

#### Text Input
```typescript
fieldName: {
  type: 'text',
  label: 'Display Name',
  description: 'Optional help text',
  defaultValue: 'Default value',
  placeholder: 'Placeholder text...',
  required: true
}
```

#### Number Input
```typescript
count: {
  type: 'number',
  label: 'Count',
  defaultValue: 10,
  min: 1,
  max: 100
}
```

#### Boolean Toggle
```typescript
enabled: {
  type: 'boolean',
  label: 'Enable Feature',
  description: 'Toggle this feature on or off',
  defaultValue: true
}
```

#### Select Dropdown
```typescript
theme: {
  type: 'select',
  label: 'Theme',
  defaultValue: 'dark',
  options: [
    { label: 'Dark Theme', value: 'dark' },
    { label: 'Light Theme', value: 'light' },
    { label: 'Auto', value: 'auto' }
  ]
}
```

#### Textarea
```typescript
content: {
  type: 'textarea',
  label: 'Content',
  placeholder: 'Enter your content here...',
  rows: 5,
  defaultValue: ''
}
```

#### Color Picker
```typescript
accentColor: {
  type: 'color',
  label: 'Accent Color',
  defaultValue: '#3b82f6'
}
```

#### Authentication Key
```typescript
apiKey: {
  type: 'authKey',
  label: 'API Key',
  service: 'openweather',  // Must match service name in settings
  description: 'Required for weather data'
}
```

### Accessing Configuration

```typescript
const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const { apiKey, refreshInterval, showDetails } = widget.config;
  
  // Update configuration
  const updateConfig = (newValues: Partial<typeof widget.config>) => {
    onUpdate(widget.id, {
      ...widget,
      config: { ...widget.config, ...newValues }
    });
  };
  
  return (
    // Widget JSX...
  );
};
```

## 🔧 Advanced Features

### Notifications

Enable and use the notification system:

```typescript
// Widget Config
features: {
  notifications: {
    sound: true,  // or URL string for custom sound
    desktop: true,
    toast: true
  }
}

// In Component
import { useWidgetNotifications } from '../../hooks/useWidgetNotifications';

const MyWidget: React.FC<WidgetProps> = ({ widget }) => {
  const { sendNotification } = useWidgetNotifications(myWidgetConfig);
  
  const handleComplete = () => {
    sendNotification('Task completed!', {
      type: 'success',
      duration: 5000,
      soundOptions: {
        url: 'https://example.com/success.mp3',
        volume: 0.7
      }
    });
  };
};
```

### Authentication

For widgets requiring API keys:

```typescript
// Widget Config
features: {
  needsAuth: ['openweather', 'github']  // Required services
}

// In Component
const { apiKey } = widget.config;

if (!apiKey) {
  return (
    <div className="p-4 text-center text-white/70">
      Please configure your API key in widget settings
    </div>
  );
}
```

### Content-Driven Height

For widgets with dynamic content height:

```typescript
features: {
  contentDrivenHeight: true  // Widget height follows content
}
```

### Singleton Widgets

Limit to one instance per dashboard:

```typescript
singleton: true  // Only one instance allowed
```

### Disabling Features

```typescript
features: {
  resizable: false,        // Disable resizing
  fullscreenable: false,   // Disable fullscreen
  configurable: false,     // Disable configuration
  showChrome: false        // Hide widget container
}
```

## 🎨 Styling & Theming

### Theme-Aware Colors

Use CSS custom properties for dynamic theming:

```typescript
<div className="bg-accent-900 border border-accent-700 text-accent-100">
  <h3 className="text-accent-500">Themed Content</h3>
  <button className="bg-accent-600 hover:bg-accent-700">
    Themed Button
  </button>
</div>
```

### Available Color Classes

- **Background**: `bg-accent-50` to `bg-accent-950`
- **Text**: `text-accent-50` to `text-accent-950`
- **Border**: `border-accent-50` to `border-accent-950`
- **Ring**: `ring-accent-50` to `ring-accent-950`

### Custom Scrollbars

For scrollable content:

```typescript
<div className="overflow-auto scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-transparent hover:scrollbar-thumb-accent-600">
  {/* Scrollable content */}
</div>
```

### Responsive Design

Use Tailwind's responsive classes:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## 📝 Best Practices

### 1. **State Management**
```typescript
// ✅ Persist important state
const handleChange = (value: string) => {
  onUpdate(widget.id, {
    ...widget,
    config: { ...widget.config, lastValue: value }
  });
};

// ❌ Don't rely only on component state for persistence
const [value, setValue] = useState(''); // Lost on refresh
```

### 2. **Error Handling**
```typescript
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await api.getData();
    // Process data...
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

if (error) {
  return <div className="p-4 text-red-400">Error: {error}</div>;
}

if (loading) {
  return <div className="p-4 text-white/70">Loading...</div>;
}
```

### 3. **Performance Optimization**
```typescript
// ✅ Memoize expensive computations
const processedData = useMemo(() => {
  return heavyComputation(rawData);
}, [rawData]);

// ✅ Debounce frequent updates
const debouncedUpdate = useCallback(
  debounce((value) => onUpdate(widget.id, { ...widget, config: { ...widget.config, value } }), 500),
  [widget.id]
);
```

### 4. **Accessibility**
```typescript
<button
  aria-label="Close widget"
  className="focus:outline-none focus:ring-2 focus:ring-accent-500"
>
  <X size={16} />
</button>
```

### 5. **TypeScript Best Practices**
```typescript
// Define specific config interface
interface MyWidgetConfig {
  message: string;
  count: number;
  enabled: boolean;
}

const MyWidget: React.FC<WidgetProps> = ({ widget }) => {
  const config = widget.config as MyWidgetConfig;
  // Now config has proper typing
};
```

## 💡 Examples

### Data Fetching Widget

```typescript
import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
}

const WeatherWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const { apiKey, city, units } = widget.config;
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    if (!apiKey || !city) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`
      );
      
      if (!response.ok) throw new Error('Weather data unavailable');
      
      const result = await response.json();
      setData({
        temperature: Math.round(result.main.temp),
        description: result.weather[0].description,
        humidity: result.main.humidity
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [apiKey, city, units]);

  if (!apiKey) {
    return (
      <div className="p-4 text-center text-white/70">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p>Please configure your OpenWeather API key</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{city}</h3>
        <button
          onClick={fetchWeather}
          className="p-1 hover:bg-white/10 rounded"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {error ? (
        <div className="text-red-400 text-sm">{error}</div>
      ) : data ? (
        <div className="space-y-2">
          <div className="text-3xl font-bold text-accent-400">
            {data.temperature}°{units === 'metric' ? 'C' : 'F'}
          </div>
          <div className="text-white/70 capitalize">{data.description}</div>
          <div className="text-sm text-white/60">Humidity: {data.humidity}%</div>
        </div>
      ) : (
        <div className="text-white/70">Loading weather...</div>
      )}
    </div>
  );
};

export const weatherWidgetConfig: WidgetConfig = {
  type: 'weather',
  name: 'Weather',
  description: 'Display current weather conditions',
  version: '1.0.0',
  component: WeatherWidget,
  icon: CloudSun,
  defaultSize: { width: 250, height: 200 },
  minSize: { width: 200, height: 150 },
  maxSize: { width: 400, height: 300 },
  features: {
    needsAuth: ['openweather']
  },
  configFields: {
    apiKey: {
      type: 'authKey',
      service: 'openweather',
      label: 'OpenWeather API Key',
      description: 'Get your free API key from openweathermap.org'
    },
    city: {
      type: 'text',
      label: 'City',
      defaultValue: 'London',
      required: true
    },
    units: {
      type: 'select',
      label: 'Temperature Units',
      defaultValue: 'metric',
      options: [
        { label: 'Celsius', value: 'metric' },
        { label: 'Fahrenheit', value: 'imperial' }
      ]
    }
  },
  categories: ['Weather', 'Information']
};
```

## 🐛 Troubleshooting

### Common Issues

#### Widget Not Appearing
- Check that the config is exported with `*WidgetConfig` suffix
- Verify the file is in the correct directory (`src/widgets/base/` or `src/widgets/custom/`)
- Ensure `type` field is unique

#### Configuration Not Saving
- Call `onUpdate` with the complete widget object
- Include all existing config values when updating

#### Styling Issues
- Use theme-aware color classes (`accent-*`)
- Ensure proper contrast for accessibility
- Test with all available color schemes

#### Performance Problems
- Use `useMemo` for expensive computations
- Implement proper cleanup in `useEffect`
- Debounce frequent updates

### Debugging Tips

```typescript
// Add debugging console logs
useEffect(() => {
  console.log('Widget config changed:', widget.config);
}, [widget.config]);

// Validate configuration
const validateConfig = (config: any) => {
  const required = ['apiKey', 'endpoint'];
  const missing = required.filter(key => !config[key]);
  if (missing.length > 0) {
    console.warn(`Missing required config: ${missing.join(', ')}`);
  }
};
```

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)

---

**Happy widget development! 🎉**

*For questions or support, check the main project repository or create an issue.* 