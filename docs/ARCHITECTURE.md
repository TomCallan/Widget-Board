# Project Architecture

This document outlines key parts of the Dash code base and provides tips for improving performance and modularity.

## Directory Overview

- **src/components** – Reusable UI components shared across widgets.
- **src/contexts** – React contexts for global state such as settings and notifications.
- **src/hooks** – Custom hooks, including helpers for dashboards and local storage.
- **src/widgets** – Built-in widgets and custom user widgets.
- **src/dev** – Development utilities such as the widget marketplace demo.

## Modularity Guidelines

- Keep widgets self‑contained. Each widget should export its `WidgetConfig` and component from a single file.
- Use React context providers to share state between components instead of prop drilling.
- Prefer composition over inheritance for new UI components.
- Avoid tightly coupling widgets to application logic so that they can be loaded dynamically.

## Performance Tips

- Widgets are discovered at runtime via `import.meta.glob` and loaded eagerly. Consider switching to lazy loading with dynamic `import()` when widgets grow in number to reduce the initial bundle size.
- Memoize expensive computations inside widgets with `useMemo` or `React.memo` to prevent unnecessary re-renders.
- The build output currently produces a main bundle larger than 1 MB. Check the browser dev tools for large dependencies and split them into separate chunks using Vite's `manualChunks` option.
- Use `requestIdleCallback` or debounced state updates for operations triggered by resize or drag events.

## Contributing

1. Run `npm install` once after cloning the repository.
2. Use `npm run dev` to start the development server.
3. Execute `npm run lint` before committing to catch common issues.
4. Please keep documentation up to date when adding new widgets or significant features.

