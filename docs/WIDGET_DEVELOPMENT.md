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

To create a new widget:

1. Create a new TypeScript file in the `src/widgets/custom` directory
2. Import the necessary types and components
3. Create your widget component
4. Export your widget configuration
5. Register your widget with the platform

Here's a complete example:

```typescript
import React from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { YourIcon } from 'lucide-react';

const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  // Access widget state
  const config = widget.config;
  
  // Update widget state
  const updateConfig = (updates: any) => {
    onUpdate(widget.id, {
      config: { ...config, ...updates }
    });
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className={`font-semibold ${widget.isFullscreen ? 'text-xl' : 'text-sm'}`}>
        My Custom Widget
      </h3>
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
    hasSettings: false
  },
  categories: ['PRODUCTIVITY'], // Use available categories
  author: {
    name: 'Your Name',
    email: 'your@email.com',
    url: 'https://your-website.com'
  }
};
```

## Widget Structure

### Required Properties

Every widget must implement the `WidgetConfig` interface with these required properties:

- `type`: Unique identifier for your widget type (must start with 'custom-', e.g., 'custom-calculator')
- `name`: Display name shown in the widget header and selector
- `description`: Brief description of the widget's functionality
- `defaultSize`: Initial dimensions when first added
- `minSize`: Minimum allowed dimensions when resizing
- `maxSize`: Maximum allowed dimensions when resizing
- `component`: The React component that renders your widget
- `icon`: An icon from lucide-react library
- `version`: Semantic version number (e.g., '1.0.0')

### Optional Properties

- `features`: Object defining supported features
  ```typescript
  features: {
    resizable?: boolean;      // Enable/disable resizing
    fullscreenable?: boolean; // Enable/disable fullscreen mode
    hasSettings?: boolean;    // Enable/disable settings panel
  }
  ```
- `categories`: Array of categories the widget belongs to
- `author`: Information about the widget creator
- `license`: License type
- `repository`: Link to source code
- `dependencies`: Required external dependencies

## Widget Features

### Responsive Design

Your widget should handle both compact and fullscreen modes gracefully:

```typescript
const MyWidget: React.FC<WidgetProps> = ({ widget }) => {
  return (
    <div className="h-full">
      {/* Conditional rendering based on mode */}
      {widget.isFullscreen ? (
        <FullscreenView />
      ) : (
        <CompactView />
      )}
    </div>
  );
};
```

### State Management

Widgets receive these props:
```typescript
interface WidgetProps {
  widget: Widget;          // Current widget instance
  onUpdate: (id: string, updates: Partial<Widget>) => void;
  onRemove: (id: string) => void;
  onResize?: (id: string, size: { width: number; height: number }) => void;
  onToggleFullscreen?: (id: string) => void;
}
```

Store widget state in the `config` object:
```typescript
const updateConfig = (updates: any) => {
  onUpdate(widget.id, {
    config: { ...widget.config, ...updates }
  });
};
```

### Styling Guidelines

1. Use Tailwind CSS classes for consistent styling
2. Follow the platform's design system
3. Support dark mode by default
4. Use relative units for better scaling
5. Implement proper spacing and padding

Example:
```typescript
<div className="p-4 space-y-4 text-white/70">
  <h3 className="font-semibold text-white">Title</h3>
  <div className="bg-white/10 rounded-lg p-3">
    Content
  </div>
</div>
```

## Best Practices

1. **Performance**
   - Use React.memo for expensive components
   - Implement proper cleanup in useEffect
   - Optimize re-renders
   - Lazy load heavy dependencies

2. **Error Handling**
   - Implement error boundaries
   - Provide meaningful error messages
   - Handle API failures gracefully
   - Validate user input

3. **Accessibility**
   - Use semantic HTML
   - Provide ARIA attributes
   - Support keyboard navigation
   - Maintain sufficient color contrast

4. **Testing**
   - Test all features and interactions
   - Verify resource cleanup
   - Test different screen sizes
   - Validate error handling
   - Check performance impact

## Publishing to Marketplace

Before publishing:

1. **Documentation**
   - Clear description
   - Usage instructions
   - Configuration options
   - Example scenarios

2. **Quality Checks**
   - Code linting
   - Type checking
   - Performance testing
   - Cross-browser testing

3. **Metadata**
   - Accurate categories
   - Relevant tags
   - Complete author information
   - Clear version number

4. **Assets**
   - High-quality screenshots
   - Demo video (if applicable)
   - Example configurations 