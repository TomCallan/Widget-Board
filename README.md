# Widget Development Guide

## Overview
This guide will help you create custom widgets for the Dash platform. Widgets are modular components that can be added to the dashboard to provide various functionalities.

## Widget Structure
A widget consists of the following key components:

1. Widget Configuration
2. Widget Component
3. Widget State Management

### Basic Widget Template
```typescript
import React from 'react';
import { WidgetProps } from '../types/widget';

export const MyCustomWidget: React.FC<WidgetProps> = ({ 
  widget, 
  onUpdate, 
  onRemove,
  onToggleFullscreen,
  isFullscreen 
}) => {
  return (
    <div className="widget-container">
      {/* Your widget content */}
    </div>
  );
};

export const myCustomWidgetConfig: WidgetConfig = {
  type: 'my-custom-widget',
  name: 'My Custom Widget',
  description: 'Description of what your widget does',
  version: '1.0.0',
  author: 'Your Name',
  defaultSize: { width: 300, height: 200 },
  minSize: { width: 200, height: 150 },
  maxSize: { width: 800, height: 600 },
  component: MyCustomWidget,
  icon: MyCustomWidgetIcon,
  supportsFullscreen: true,
  fullscreenSize: { width: 1200, height: 800 },
  tags: ['category1', 'category2'],
  documentation: 'https://link-to-docs',
};
```

## Features

### Resizing and Fullscreen
Widgets can support both manual resizing and fullscreen mode:

1. Manual Resizing:
   - Use the `minSize` and `maxSize` in your widget config
   - The widget container handles resize events automatically

2. Fullscreen Mode:
   - Set `supportsFullscreen: true` in your widget config
   - Use `fullscreenSize` to specify dimensions
   - Handle the `isFullscreen` prop in your component
   - Use `onToggleFullscreen` to switch modes

### State Management
- Use the `widget.config` object to store widget-specific state
- Call `onUpdate` to persist changes:
```typescript
onUpdate(widget.id, {
  config: {
    ...widget.config,
    myNewSetting: value
  }
});
```

### Styling
- Use Tailwind CSS classes for consistent styling
- Follow the platform's design system
- Support both light and dark themes

## Best Practices

1. Performance
   - Implement proper cleanup in useEffect hooks
   - Use memoization for expensive calculations
   - Lazy load heavy dependencies

2. Error Handling
   - Implement error boundaries
   - Provide meaningful error messages
   - Gracefully handle API failures

3. Accessibility
   - Use semantic HTML
   - Include ARIA labels
   - Support keyboard navigation

4. Testing
   - Write unit tests for your widget
   - Test different screen sizes
   - Test error scenarios

## Publishing to Widget Marketplace

1. Prepare Your Widget:
   - Ensure all required fields in WidgetConfig are filled
   - Include screenshots
   - Write comprehensive documentation
   - Version your widget properly (semver)

2. Testing:
   - Test in development mode
   - Verify all features work
   - Check for performance issues

3. Submission:
   - Package your widget
   - Submit to the marketplace
   - Provide support contact

## Development Mode

Enable development mode for additional features:
```typescript
const devConfig: WidgetDevelopmentConfig = {
  devMode: true,
  hot: true,
  debugMode: true
};
```

## Examples

Check the existing widgets in this directory for real-world examples:
- CalendarWidget: Example of fullscreen support
- WeatherWidget: Example of API integration
- TodoWidget: Example of state management

## Support

For questions or issues:
1. Check the documentation
2. Review existing issues
3. Open a new issue with detailed information

---

Remember to follow the platform's guidelines and best practices when developing your widget. Happy coding! 