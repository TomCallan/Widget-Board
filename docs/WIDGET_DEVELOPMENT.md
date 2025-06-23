# Widget Development Guide

This guide provides comprehensive documentation for creating widgets for the Dash platform. Whether you're building widgets for personal use or planning to publish them to the widget marketplace, this document covers everything you need to know.

## Table of Contents
- [Getting Started](#getting-started)
- [Widget Architecture](#widget-architecture)
- [Widget Structure](#widget-structure)
- [Widget Features](#widget-features)
  - [Configuration System](#configuration-system)
  - [Resizing](#resizing)
  - [Fullscreen Mode](#fullscreen-mode)
  - [State Management](#state-management)
  - [Interactive Features](#interactive-features)
  - [Data Visualization](#data-visualization)
- [Widget Lifecycle](#widget-lifecycle)
- [Best Practices](#best-practices)
- [Example Widget](#example-widget)
- [Publishing to Marketplace](#publishing-to-marketplace)
- [API Key Management](#api-key-management)
- [State Management Best Practices](#state-management-best-practices)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)

## Getting Started

To create a new widget:

1. Create a new TypeScript file in the `src/widgets/custom` directory
2. Import the necessary types and components
3. Create your widget component
4. Export your widget configuration

The platform will automatically discover and load your widget - there's no need to register it manually. All core functionality like fullscreen, resizing, removal, and configuration is handled by the platform's widget container.

Here's a basic example:

```typescript
import React from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { YourIcon } from 'lucide-react';

interface WidgetState {
  // Define your widget's state interface
  count: number;
}

const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  // Access widget state
  const config = widget.config as WidgetState;
  
  // Update widget state
  const updateConfig = (updates: Partial<WidgetState>) => {
    onUpdate(widget.id, {
      config: { ...config, ...updates }
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Your widget content here */}
    </div>
  );
};

export const myWidgetConfig: WidgetConfig = {
  type: 'custom-my-widget',
  name: 'My Widget',
  description: 'A description of what your widget does',
  defaultSize: { width: 300, height: 200 },
  minSize: { width: 200, height: 150 },
  maxSize: { width: 800, height: 600 },
  component: MyWidget,
  icon: YourIcon,
  version: '1.0.0',
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: true
  },
  configFields: {
    // Define configuration fields here
  },
  categories: ['PRODUCTIVITY'], // Use available categories
  author: {
    name: 'Your Name',
    email: 'your@email.com',
    url: 'https://your-website.com'
  }
};
```

## Widget Architecture

The Dash platform uses a dynamic widget loading system with the following key features:

1. **Automatic Discovery**
   - Widgets are automatically discovered from the `src/widgets/base` and `src/widgets/custom` directories
   - Each widget file should export both a component and its configuration
   - No manual registration or imports required

2. **Built-in Functionality**
   - The platform provides a `WidgetContainer` component that handles:
     - Widget positioning and dragging
     - Resizing controls
     - Fullscreen toggle
     - Configuration dialog
     - Remove button
     - Error boundaries
   - Widget developers only need to focus on their widget's core functionality

3. **Props and Updates**
   - Widgets receive standardized props through the `WidgetProps` interface
   - All widget state updates should use the provided `onUpdate` function
   - The platform handles persistence and state management

## Widget Features

### Configuration System

The configuration system allows widgets to have user-configurable settings. To implement configuration:

1. Set `configurable: true` in the widget's features
2. Define configuration fields in `configFields`
3. Use the configuration values from `widget.config`

Available field types:

```typescript
interface WidgetConfigField {
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'authKey';
  label: string;
  description?: string;
  default?: any;
  options?: { label: string; value: any }[]; // For select type
  min?: number; // For number type
  max?: number; // For number type
  service?: string; // For authKey type
  required?: boolean; // For authKey type
}
```

Example configuration:

```typescript
configFields: {
  theme: {
    type: 'select',
    label: 'Theme',
    description: 'Choose the widget theme',
    default: 'light',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
      { label: 'System', value: 'system' }
    ]
  },
  refreshInterval: {
    type: 'number',
    label: 'Refresh Interval',
    description: 'Update frequency in seconds',
    default: 60,
    min: 30,
    max: 3600
  },
  accentColor: {
    type: 'color',
    label: 'Accent Color',
    description: 'Widget highlight color',
    default: '#6366f1'
  },
  apiKey: {
    type: 'authKey',
    label: 'API Key',
    description: 'Select your service API key',
    service: 'ServiceName',
    required: true,
  }
}
```

### Interactive Features

When building interactive widgets, consider implementing these features:

1. **Collapsible Sections**
```typescript
const Section: React.FC<{
  title: string;
  id: string;
  children: React.ReactNode;
}> = ({ title, id, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3"
      >
        <span>{title}</span>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isExpanded && (
        <div className="p-3 border-t border-white/10">
          {children}
        </div>
      )}
    </div>
  );
};
```

2. **Status Indicators**
```typescript
const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
  );
};
```

3. **Loading States**
```typescript
const LoadingOverlay: React.FC = () => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
    <RefreshCw className="animate-spin" />
  </div>
);
```

### Data Visualization

When creating widgets with charts or data visualizations:

1. **Interactive Chart Example**
```typescript
const Chart: React.FC<{ data: ChartData }> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.values);
  
  return (
    <div className="space-y-4">
      <div className="h-40 flex items-end gap-2">
        {data.values.map((value, i) => (
          <div 
            key={i} 
            className="flex-1 flex flex-col items-center"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative flex-1 w-full flex items-end">
              <div 
                className={`w-full bg-purple-500/50 hover:bg-purple-500/70 
                           transition-colors cursor-pointer ${
                  hoveredIndex === i ? 'bg-purple-500/70' : ''
                }`}
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
              {hoveredIndex === i && (
                <div className="absolute bottom-full left-1/2 transform 
                              -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 
                              rounded text-xs whitespace-nowrap">
                  {value} on {data.labels[i]}
                </div>
              )}
            </div>
            <span className="text-xs mt-1 text-white/70">
              {data.labels[i]}
            </span>
          </div>
        ))}
      </div>
      
      {/* Summary Section */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-white/5 p-2 rounded">
          <div className="text-white/70">Highest</div>
          <div className="font-medium">{Math.max(...data.values)}</div>
        </div>
        <div className="bg-white/5 p-2 rounded">
          <div className="text-white/70">Average</div>
          <div className="font-medium">
            {Math.round(data.values.reduce((a, b) => a + b, 0) / data.values.length)}
          </div>
        </div>
      </div>
    </div>
  );
};
```

2. **Visualization Best Practices**
   - Provide clear hover states and tooltips
   - Include summaries and legends
   - Use appropriate animations and transitions
   - Handle different screen sizes and orientations
   - Consider accessibility with ARIA labels
   - Optimize performance with useMemo/useCallback

### Responsive Design

Widgets should adapt to both normal and fullscreen modes:

```typescript
return (
  <div className="h-full flex flex-col">
    {widget.isFullscreen ? (
      // Fullscreen layout
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <Section title="Main Content">
            {/* Primary content */}
          </Section>
          <Section title="Additional Info">
            {/* Secondary content */}
          </Section>
        </div>
        <div className="space-y-4">
          <Section title="Details">
            {/* Detailed information */}
          </Section>
          <Section title="Analytics">
            {/* Charts and data */}
          </Section>
        </div>
      </div>
    ) : (
      // Compact layout
      <div className="space-y-3">
        <Section title="Quick Stats">
          {/* Summary view */}
        </Section>
        <Section title="Recent Items">
          {/* Limited list */}
        </Section>
      </div>
    )}
  </div>
);
```

## Widget Lifecycle

1. **Initialization**
   - Widget is created with default configuration
   - Initial state is loaded from storage if available

2. **Mount**
   - Component mounts
   - Set up event listeners
   - Initialize external resources

3. **Updates**
   - Handle prop changes
   - Update internal state
   - Persist changes via onUpdate

4. **Unmount**
   - Clean up event listeners
   - Release external resources

Example:
```typescript
const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  useEffect(() => {
    // Setup
    const cleanup = setupResources();
    
    return () => {
      // Cleanup
      cleanup();
    };
  }, []);

  // Handle updates
  useEffect(() => {
    handleConfigChanges(widget.config);
  }, [widget.config]);
};
```

## Best Practices

1. **State Management**
   - Use appropriate React hooks (useState, useEffect, useMemo)
   - Clean up resources and subscriptions
   - Handle loading and error states
   - Implement proper data refresh logic

2. **Performance**
   - Optimize re-renders with proper hooks
   - Use debouncing for frequent updates
   - Implement proper cleanup
   - Consider lazy loading for heavy components

3. **Error Handling**
   - Implement error boundaries
   - Show meaningful error messages
   - Provide fallback content
   - Handle edge cases gracefully

4. **Styling**
   - Use Tailwind CSS for consistent styling
   - Follow the platform's design system
   - Support both light and dark themes
   - Use relative units for better scaling

5. **Accessibility**
   - Include proper ARIA attributes
   - Support keyboard navigation
   - Maintain sufficient color contrast
   - Provide text alternatives for visual elements

## Example Widget

For a complete example that demonstrates all these features and best practices, refer to the Developer Example widget in `src/widgets/custom/DeveloperExampleWidget.tsx`. This widget showcases:

- Interactive features
- Data visualization
- Responsive layouts
- Configuration options
- State management
- Error handling
- Loading states
- Best practices implementation

## Publishing to Marketplace

Before publishing your widget:

1. **Documentation**
   - Clear description and usage instructions
   - Configuration options explained
   - Examples and screenshots
   - Dependencies listed

2. **Quality Checks**
   - Test all features and interactions
   - Verify error handling
   - Check performance impact
   - Validate accessibility

3. **Package**
   - Update version number
   - Include all dependencies
   - Add license information
   - Include README

4. **Submit**
   - Create pull request
   - Provide demo
   - Include test cases
   - Wait for review

## Available Categories

Widgets can belong to one or more of these categories:
- `TIME`: Time & Date related widgets
- `PRODUCTIVITY`: Task and organization widgets
- `SYSTEM`: System monitoring and control widgets
- `TOOLS`: Utility and calculation widgets
- `INFORMATION`: Data display and news widgets

## Example Widgets

For reference implementations, check out these base widgets:
- `ClockWidget`: Time display with configuration
- `TodoWidget`: Task management with persistence
- `WeatherWidget`: API integration example
- `CalculatorWidget`: Complex state management
- `SystemStatsWidget`: System integration

Each example demonstrates different aspects of widget development and can be used as a starting point for your own widgets.

## API Key Management

The dashboard includes a built-in API key management system that allows widgets to securely use API keys for external services.

### Adding API Key Support to a Widget

1. Add an auth key field to your widget configuration:

```typescript
configFields: {
  apiKey: {
    type: 'authKey',
    label: 'API Key',
    description: 'Select your service API key',
    service: 'ServiceName',
    required: true,
  }
}
```

2. Access the key in your widget component:

```typescript
import { useAuthKeys } from '../hooks/useAuthKeys';

export const MyWidget: React.FC<WidgetProps> = ({ widget }) => {
  const { getKeyValue } = useAuthKeys();
  const apiKey = widget.config.apiKey ? getKeyValue(widget.config.apiKey) : null;

  useEffect(() => {
    if (apiKey) {
      // Make API calls using the key
      fetchData(apiKey);
    }
  }, [apiKey]);

  // ... rest of the component
};
```

### Auth Key Features

- **Secure Storage**: Keys are stored securely in the browser's local storage
- **Service-Specific**: Keys can be organized by service
- **Key Management UI**: Users can add, remove, and manage keys through the settings dialog
- **Key Selection**: Widgets can filter keys by service
- **Automatic Updates**: Widgets automatically update when keys change

### Example: Weather Widget with API Key

```typescript
export const weatherWidgetConfig: WidgetConfig = {
  // ... other config properties ...
  features: {
    configurable: true,
  },
  configFields: {
    apiKey: {
      type: 'authKey',
      label: 'Weather API Key',
      description: 'Select your OpenWeatherMap API key',
      service: 'OpenWeatherMap',
      required: true,
    },
    location: {
      type: 'text',
      label: 'Location',
      defaultValue: 'London, UK',
    },
  },
};

export const WeatherWidget: React.FC<WidgetProps> = ({ widget }) => {
  const { getKeyValue } = useAuthKeys();
  const apiKey = widget.config.apiKey ? getKeyValue(widget.config.apiKey) : null;

  useEffect(() => {
    if (apiKey) {
      fetchWeatherData(widget.config.location, apiKey);
    }
  }, [apiKey, widget.config.location]);

  // ... rest of the component
};
```

## State Management Best Practices

### Configuration Initialization
When initializing widget configuration, always follow these guidelines:

1. Define default values for ALL configuration fields
2. Use proper type checking and safe access patterns
3. Handle nested configuration structures carefully

Example:
```typescript
interface WidgetConfig {
  setting1: string;
  setting2: number;
}

const defaultConfig: WidgetConfig = {
  setting1: 'default',
  setting2: 0
};

// In your widget component:
const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  // Safely initialize config with defaults
  const config = {
    ...defaultConfig,
    ...widget.config
  };

  // Use a stable dependency for useEffect
  useEffect(() => {
    // Your effect code
  }, [JSON.stringify(config)]); // Prevents infinite loops
};
```

### Common Pitfalls to Avoid

1. **Infinite Update Loops**
   - Always use proper dependency arrays in useEffect
   - Use JSON.stringify for object dependencies
   - Consider using useMemo for complex objects
   - Avoid updating state directly in useEffect without conditions

2. **Undefined Properties**
   - Always provide default values
   - Use optional chaining (?.) for nested properties
   - Add type checking for all properties
   - Use proper TypeScript interfaces

3. **State Updates**
   - Keep state updates atomic
   - Use functional updates for state that depends on previous values
   - Avoid updating state in rapid succession
   - Consider using useReducer for complex state

## Error Handling

The Dash platform includes built-in error boundaries for widgets. However, you should still implement proper error handling in your widget:

1. **Data Validation**
```typescript
// Validate incoming data
const validateConfig = (config: unknown): config is WidgetConfig => {
  if (!config || typeof config !== 'object') return false;
  // Add your validation logic
  return true;
};

// Use in your widget
if (!validateConfig(widget.config)) {
  throw new Error('Invalid widget configuration');
}
```

2. **Async Operations**
```typescript
const fetchData = async () => {
  try {
    const data = await api.getData();
    setData(data);
  } catch (error) {
    console.error('Widget data fetch error:', error);
    setError('Failed to load data');
  }
};
```

3. **Fallback UI**
```typescript
const MyWidget: React.FC<WidgetProps> = ({ widget }) => {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="widget-error">
        <p>{error}</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  // Normal widget render
};
```

## Testing

Always test your widget with various scenarios:

1. Invalid/missing configuration
2. Network failures
3. Empty data states
4. Edge cases in data processing
5. Rapid state updates

## Performance Optimization

1. **Memoization**
```typescript
const memoizedValue = useMemo(() => computeExpensiveValue(config), 
  [JSON.stringify(config)]
);

const memoizedCallback = useCallback(() => {
  // Handle event
}, [/* dependencies */]);
```

2. **Render Optimization**
- Use React.memo for pure components
- Avoid unnecessary re-renders
- Keep state as local as possible
- Use proper key props in lists

## Widget Lifecycle

Your widget should properly handle:

1. **Initialization**
   - Default state
   - Configuration validation
   - Resource setup

2. **Updates**
   - Configuration changes
   - Props changes
   - State updates

3. **Cleanup**
   - Resource cleanup
   - Event listener removal
   - Timer cleanup

Example:
```typescript
const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  useEffect(() => {
    // Setup
    const interval = setInterval(() => {
      // Update logic
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(interval);
      // Additional cleanup
    };
  }, [/* dependencies */]);
};
```

Remember: The widget container provides error boundaries, but your widget should still handle errors gracefully when possible. 