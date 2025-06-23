# Notification System

The Dash application includes a flexible notification system that supports multiple notification types and methods. This document explains how to use notifications in your widgets.

## Features

- **Toast Notifications**: Visual notifications that appear in the bottom-right corner
- **Sound Notifications**: Customizable audio notifications
- **Desktop Notifications**: System-level notifications (requires user permission)

## Widget Configuration

To enable notifications in your widget, add the notifications feature to your widget configuration:

```typescript
export const myWidgetConfig: WidgetConfig = {
  // ... other config options ...
  features: {
    notifications: {
      sound: true, // Enable sound notifications with default sound
      // OR
      sound: 'https://example.com/notification.mp3', // Use a custom sound URL
      desktop: true, // Enable desktop notifications
      toast: true // Enable toast notifications
    }
  }
};
```

## Using Notifications in Widgets

1. Import the hook:
```typescript
import { useWidgetNotifications } from '../../hooks/useWidgetNotifications';
```

2. Use the hook in your widget:
```typescript
const { sendNotification } = useWidgetNotifications(widgetConfig);
```

3. Send notifications:
```typescript
// Basic notification
sendNotification('Hello world!');

// With type and duration
sendNotification('Task completed!', {
  type: 'success', // 'info' | 'success' | 'warning' | 'error'
  duration: 5000 // milliseconds
});

// With custom sound
sendNotification('Timer finished!', {
  type: 'success',
  soundOptions: {
    url: 'https://example.com/custom-sound.mp3',
    volume: 0.5 // Optional: 0.0 to 1.0
  }
});
```

## Notification Types

- `info` (default): Blue styling
- `success`: Green styling
- `warning`: Yellow styling
- `error`: Red styling

## Sound Notifications

You can use sound notifications in three ways:

1. **Default Widget Sound**:
```typescript
notifications: {
  sound: true
}
```

2. **Widget-specific Default Sound**:
```typescript
notifications: {
  sound: 'https://example.com/widget-sound.mp3'
}
```

3. **Per-notification Custom Sound**:
```typescript
sendNotification('Message', {
  soundOptions: {
    url: 'https://example.com/custom-sound.mp3',
    volume: 0.8
  }
});
```

## Desktop Notifications

Desktop notifications require user permission. The system will automatically request permission when needed. To enable:

```typescript
notifications: {
  desktop: true
}
```

## Best Practices

1. **Sound Selection**:
   - Use short, non-intrusive sounds
   - Ensure sounds are appropriate for the notification type
   - Test sounds at different volumes

2. **Message Content**:
   - Keep messages clear and concise
   - Include relevant context
   - Use appropriate notification types

3. **Duration**:
   - Use longer durations for important messages
   - Use shorter durations for frequent updates
   - Default duration is 5000ms (5 seconds)

4. **Performance**:
   - Audio files are cached for better performance
   - Invalid audio URLs are automatically removed from cache
   - Multiple simultaneous sounds are handled gracefully

## Example Implementation

Here's a complete example of a widget using notifications:

```typescript
import React from 'react';
import { WidgetProps, WidgetConfig } from '../../types/widget';
import { useWidgetNotifications } from '../../hooks/useWidgetNotifications';

export const MyWidget: React.FC<WidgetProps> = ({ widget }) => {
  const { sendNotification } = useWidgetNotifications(myWidgetConfig);

  const handleImportantEvent = () => {
    sendNotification('Important event occurred!', {
      type: 'warning',
      duration: 10000,
      soundOptions: {
        url: 'https://example.com/alert.mp3',
        volume: 0.7
      }
    });
  };

  return (
    // ... widget implementation
  );
};

export const myWidgetConfig: WidgetConfig = {
  // ... other config
  features: {
    notifications: {
      sound: 'https://example.com/default-sound.mp3',
      desktop: true,
      toast: true
    }
  }
}; 