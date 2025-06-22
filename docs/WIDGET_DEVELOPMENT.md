# Widget Development Guide

This guide will help you create custom widgets for the Dash platform. Whether you're building widgets for personal use or planning to publish them to the widget marketplace, this document covers everything you need to know.

## Table of Contents
- [Getting Started](#getting-started)
- [Widget Structure](#widget-structure)
- [Widget Features](#widget-features)
- [Widget Lifecycle](#widget-lifecycle)
- [Best Practices](#best-practices)
- [Publishing to Marketplace](#publishing-to-marketplace)

## Getting Started

To create a new widget, you'll need to:

1. Create a new TypeScript file in the `src/widgets` directory
2. Export a widget configuration object
3. Implement the widget component

Here's a basic example:

```typescript
import React from 'react';
import { WidgetConfig, WidgetProps } from '../types/widget';

const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  return (
    <div>
      <h3>My Custom Widget</h3>
      {/* Your widget content here */}
    </div>
  );
};

export const myWidgetConfig: WidgetConfig = {
  type: 'my-widget',
  name: 'My Widget',
  description: 'A description of what your widget does',
  defaultSize: { width: 300, height: 200 },
  minSize: { width: 200, height: 150 },
  maxSize: { width: 800, height: 600 },
  component: MyWidget,
  icon: YourWidgetIcon,
  version: '1.0.0',
  features: {
    resizable: true,
    fullscreenable: true,
    hasSettings: false
  }
};
```

## Widget Structure

### Required Properties

- `type`: Unique identifier for your widget type
- `name`: Display name of your widget
- `description`: Brief description of what your widget does
- `defaultSize`: Default dimensions of the widget
- `minSize`: Minimum allowed dimensions
- `maxSize`: Maximum allowed dimensions
- `component`: The React component that renders your widget
- `icon`: An icon component (preferably from lucide-react)
- `version`: Semantic version number

### Optional Properties

- `author`: Information about the widget creator
- `license`: License type
- `repository`: Link to source code
- `dependencies`: Required external dependencies

## Widget Features

Widgets can support various features through the `features` property:

```typescript
features: {
  resizable: boolean;      // Enable/disable resizing
  fullscreenable: boolean; // Enable/disable fullscreen mode
  hasSettings: boolean;    // Enable/disable settings panel
}
```

### Resizable Widgets

When `resizable` is true, users can:
- Drag the bottom-right corner to resize
- Use the resize icon in the header
- The widget will respect `minSize` and `maxSize` constraints

### Fullscreen Mode

When `fullscreenable` is true:
- Users can toggle fullscreen mode via the header button
- Widget state is preserved when toggling
- Original position/size is restored when exiting fullscreen

## Widget Lifecycle

Your widget component receives these props:

```typescript
interface WidgetProps {
  widget: Widget;          // Current widget instance
  onUpdate: (id: string, updates: Partial<Widget>) => void;  // Update widget state
  onRemove: (id: string) => void;  // Remove widget
  onResize?: (id: string, size: { width: number; height: number }) => void;  // Handle resize
  onToggleFullscreen?: (id: string) => void;  // Toggle fullscreen
}
```

### State Management

- Use the `widget.config` object to store widget-specific state
- Call `onUpdate` to persist changes
- Handle resize/fullscreen events appropriately

Example:

```typescript
const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const updateConfig = (updates: any) => {
    onUpdate(widget.id, {
      config: { ...widget.config, ...updates }
    });
  };

  return (
    <div>
      {/* Widget content */}
    </div>
  );
};
```

## Best Practices

1. **Responsive Design**
   - Design your widget to work well at different sizes
   - Use relative units (%, rem) over fixed pixels
   - Test both compact and fullscreen modes

2. **Performance**
   - Implement proper cleanup in useEffect hooks
   - Optimize re-renders using React.memo or useMemo
   - Lazy load heavy dependencies

3. **Error Handling**
   - Implement proper error boundaries
   - Provide meaningful error messages
   - Gracefully handle API failures

4. **Accessibility**
   - Use semantic HTML elements
   - Provide proper ARIA attributes
   - Ensure keyboard navigation works

## Publishing to Marketplace

To publish your widget:

1. Ensure your widget meets all requirements:
   - Complete metadata (author, version, etc.)
   - Proper documentation
   - Tested across different sizes
   - No external dependencies outside package.json

2. Create a widget manifest:
   ```typescript
   const manifest: WidgetManifest = {
     id: 'your-unique-widget-id',
     type: 'my-widget',
     name: 'My Widget',
     description: '...',
     version: '1.0.0',
     author: {
       name: 'Your Name',
       email: 'your@email.com',
       url: 'https://your-website.com'
     },
     screenshots: ['url-to-screenshot-1', 'url-to-screenshot-2'],
     categories: ['productivity', 'tools'],
     tags: ['react', 'typescript']
   };
   ```

3. Submit for review:
   - Package your widget code
   - Include the manifest
   - Submit through the marketplace interface

Remember to:
- Follow semantic versioning
- Keep documentation up to date
- Respond to user feedback and bug reports
- Maintain compatibility with the platform 