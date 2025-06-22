# Base Widgets

This directory contains the built-in widgets that come with the Dash platform. Each widget follows a consistent structure that you can use as a reference when creating custom widgets.

## Widget File Structure

Each widget file should:
1. Export a React component that implements the widget's functionality
2. Export a configuration object that defines the widget's properties

Example structure:

```typescript
import React from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { YourIcon } from 'lucide-react';

// Widget Component
export const YourWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  return (
    <div>
      {/* Widget content */}
    </div>
  );
};

// Widget Configuration
export const yourWidgetConfig: WidgetConfig = {
  type: 'your-widget-type',
  name: 'Your Widget Name',
  description: 'What your widget does',
  defaultSize: { width: 300, height: 200 },
  minSize: { width: 200, height: 150 },
  maxSize: { width: 800, height: 600 },
  component: YourWidget,
  icon: YourIcon,
  version: '1.0.0',
  features: {
    resizable: true,
    fullscreenable: true,
    hasSettings: false
  }
};
```

## Important Notes

1. File Naming:
   - Use PascalCase for the file name (e.g., `ClockWidget.tsx`)
   - The file name should match the widget name
   - Always use the `.tsx` extension

2. Exports:
   - Export both the component and the config
   - The config should end with `Config` (e.g., `clockWidgetConfig`)

3. Configuration:
   - The `type` must be unique across all widgets
   - Include all required properties from the `WidgetConfig` interface
   - Choose appropriate icons from `lucide-react`

4. Component:
   - Implement the `WidgetProps` interface
   - Handle widget state updates via `onUpdate`
   - Clean up resources in `useEffect` hooks

5. Features:
   - Set appropriate feature flags based on widget capabilities
   - Consider both compact and fullscreen modes if supported
   - Implement settings if `hasSettings` is true

## Available Categories

Widgets can belong to one or more of these categories:
- TIME: Time & Date related widgets
- PRODUCTIVITY: Task and organization widgets
- SYSTEM: System monitoring and control widgets
- TOOLS: Utility and calculation widgets
- INFORMATION: Data display and news widgets

## Testing

Before committing a new widget:
1. Test all features and interactions
2. Verify proper cleanup of resources
3. Test different screen sizes
4. Validate error handling
5. Check performance impact 