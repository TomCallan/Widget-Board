# Custom Widgets

This directory is for user-created widgets that extend the functionality of the Dash platform. Follow these steps to create and register your own widget:

## Creating a Custom Widget

1. Create a new `.tsx` file in this directory for your widget
2. Import the necessary types from `../../types/widget`
3. Create your widget component
4. Export your widget configuration

Here's a template to get started:

```typescript
import React from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { YourIcon } from 'lucide-react'; // Choose an icon from lucide-react

const YourCustomWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  return (
    <div>
      {/* Your widget content here */}
    </div>
  );
};

export const yourCustomWidgetConfig: WidgetConfig = {
  type: 'your-widget-type', // Unique identifier
  name: 'Your Widget Name',
  description: 'What your widget does',
  defaultSize: { width: 300, height: 200 },
  minSize: { width: 200, height: 150 },
  maxSize: { width: 800, height: 600 },
  component: YourCustomWidget,
  icon: YourIcon,
  version: '1.0.0',
  features: {
    resizable: true,
    fullscreenable: true,
    hasSettings: false
  },
  categories: ['Your Category'], // Use categories from WIDGET_CATEGORIES
  author: {
    name: 'Your Name',
    email: 'your@email.com',
    url: 'https://your-website.com'
  }
};
```

## Registering Your Widget

Import and register your widget in your application:

```typescript
import { registerCustomWidget } from '../index';
import { yourCustomWidgetConfig } from './YourCustomWidget';

// Register your widget
registerCustomWidget(yourCustomWidgetConfig);
```

## Best Practices

1. Follow the widget development guidelines in `docs/WIDGET_DEVELOPMENT.md`
2. Ensure your widget type is unique
3. Include proper TypeScript types
4. Handle errors gracefully
5. Clean up resources in useEffect hooks
6. Support both compact and fullscreen modes if applicable
7. Follow accessibility guidelines

## Testing Your Widget

Before registering your widget:

1. Test all features and interactions
2. Verify proper cleanup of resources
3. Test different screen sizes
4. Validate error handling
5. Check performance impact

## Need Help?

- Check the widget development documentation
- Look at base widgets for examples
- Follow TypeScript types for guidance
- Test thoroughly before deployment 