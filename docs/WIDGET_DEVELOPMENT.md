# Widget Development Guide

This guide provides comprehensive documentation for creating fully self-contained widgets for the Dash platform.

## Table of Contents
- [Getting Started](#getting-started)
- [The WidgetConfig Object](#the-widgetconfig-object)
- [The Widget Component](#the-widget-component)
- [Styling Widgets](#styling-widgets)
- [Best Practices](#best-practices)

## Getting Started

To create a new widget, simply add a new `.tsx` file to the `src/widgets/custom` directory. The platform will automatically discover and load your widget. Core platform widgets reside in `src/widgets/base`.

**It is essential that widgets are fully self-contained in a single `.tsx` file.**

### Basic Example

Here is a simple example of a "Hello World" widget:
```typescript
import React from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Smile } from 'lucide-react';

const HelloWorldWidget: React.FC<WidgetProps> = ({ widget }) => {
  const { title } = widget.config;
  return (
    <div className="p-4 h-full flex flex-col items-center justify-center">
      <h3 className="text-2xl font-bold text-accent-500">{title}</h3>
      <p className="text-white/70">Widget ID: {widget.id}</p>
    </div>
  );
};

export const helloWorldWidgetConfig: WidgetConfig = {
  type: 'custom-hello-world',
  name: 'Hello World',
  description: 'A simple example of a custom widget.',
  version: '1.0.0',
  defaultSize: { width: 2, height: 2 },
  minSize: { width: 1, height: 1 },
  maxSize: { width: 4, height: 4 },
  component: HelloWorldWidget,
  icon: Smile,
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: true,
  },
  configFields: {
    title: {
      type: 'text',
      label: 'Custom Title',
      defaultValue: 'Hello, World!',
    },
  },
  categories: ['Tools'],
  tags: ['example', 'getting-started'],
  author: {
    name: 'Your Name',
  },
};
```

## The WidgetConfig Object

The exported `WidgetConfig` object is the heart of your widget. It defines how the widget integrates with the Dash platform.

| Property | Type | Required | Description |
|---|---|---|---|
| `type` | `string` | Yes | A unique identifier for your widget (e.g., `custom-my-widget`). |
| `name` | `string` | Yes | The display name of the widget. |
| `description`| `string` | Yes | A brief description of what the widget does. |
| `version` | `string` | Yes | The version of your widget (e.g., `'1.0.0'`). |
| `component` | `React.ComponentType<WidgetProps>` | Yes | The React component for your widget. |
| `icon` | `LucideIcon` | Yes | An icon from `lucide-react` to represent your widget. |
| `defaultSize`| `{ width: number; height: number }` | Yes | The default size of the widget in **pixels**. |
| `minSize` | `{ width: number; height: number }` | Yes | The minimum size the widget can be resized to in **pixels**. |
| `maxSize` | `{ width: number; height: number }` | Yes | The maximum size the widget can be resized to in **pixels**. |
| `singleton` | `boolean` | No | If `true`, only one instance of this widget can be added to the dashboard. |
| `features` | `object` | No | An object to enable or disable platform features. See below. |
| `configFields`| `Record<string, WidgetConfigField>` | No | Defines the configuration options for your widget. See below. |
| `categories` | `string[]` | No | An array of categories for organization. |
| `tags` | `string[]` | No | An array of keywords for discoverability. |
| `author` | `{ name: string; ... }` | No | Information about the widget author. |

### Features

The `features` object allows you to toggle various platform-provided functionalities.

| Property | Type | Default | Description |
|---|---|---|---|
| `resizable` | `boolean` | `true` | Allows the user to resize the widget. |
| `fullscreenable`| `boolean`| `true` | Allows the user to view the widget in fullscreen mode. |
| `configurable` | `boolean`| `true` | Enables the configuration dialog for the widget. |
| `showChrome` | `boolean`| `true` | Toggles the visibility of the widget's container (header and borders). |
| `needsAuth` | `string[]`| `[]` | A list of service names (e.g., `'GitHub'`) for which this widget requires an authentication key. The user will be prompted if a key is not available. |
| `contentDrivenHeight`| `boolean`|`false`| Allows the widget's height to be determined by its content rather than the `size` property. The grid is for alignment only. |

### Configuration Fields (`configFields`)

This is where you define the settings users can change in your widget.

| Property | Type | Description |
|---|---|---|
| `type` | `'text' \| 'number' \| 'boolean' \| 'select' \| 'authKey' \| 'textarea' \| 'color'` | The type of input to display. |
| `label` | `string` | The display label for the field. |
| `description`| `string` | Help text displayed below the input. |
| `defaultValue`| `any` | The default value for the field. |
| `placeholder`| `string` | Placeholder text for `text` and `textarea` inputs. |
| `rows` | `number` | Number of visible rows for a `textarea`. |
| `min`, `max` | `number` | Minimum and maximum values for a `number` input. |
| `options` | `{ label: string, value: any }[]` | An array of options for a `select` input. |
| `service` | `string` | For `authKey` type, specifies the service to retrieve keys from (must match a service defined in global settings). |

## The Widget Component

Your widget's React component receives `WidgetProps`, which includes:
- `widget`: The current state of your widget instance, including its `id`, `size`, `position`, and `config` data.
- `onUpdate`: A function to save any changes to the widget's state. **You must call this function to persist data.**
- `onRemove`: A function to remove the widget from the dashboard.

```typescript
const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate, onRemove }) => {
  // To update the widget's config:
  const handleSave = (newConfigValue) => {
    onUpdate(widget.id, {
      ...widget,
      config: { ...widget.config, myValue: newConfigValue }
    });
  };

  // Your component JSX...
}
```

## Styling Widgets

- **Tailwind CSS**: All styling should be done using Tailwind CSS utility classes for consistency.
- **Color Scheme**: The platform uses a dynamic color scheme driven by CSS variables. You can access the theme's accent color palette through `accent-100` to `accent-900`.
  ```html
  <div class="bg-accent-900 border-accent-700 text-accent-100">
    Styled with the theme!
  </div>
  ```
- **Custom Scrollbars**: A theme-aware custom scrollbar is available. To use it, add the following classes to your scrollable container: `scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-transparent hover:scrollbar-thumb-accent-600`.

## Best Practices
- Keep your widget fully contained within its `.tsx` file.
- Use the `onUpdate` function to persist any state changes.
- Provide clear labels and descriptions for all configuration fields.
- Leverage the theme-aware styling options for a native look and feel.
- Test your widget thoroughly in different sizes and configurations. 