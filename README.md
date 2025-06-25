# Dash - A Modern Dashboard Application

Dash is a sleek, modern, and customizable dashboard application built with React, Vite, and Tailwind CSS. It provides a flexible interface for organizing and displaying various widgets, allowing users to create a personalized information hub.

## Features

- **Customizable Dashboards:** Create multiple dashboards and tailor them to your needs.
- **Widget-Based System:** A flexible foundation for adding, removing, and configuring widgets.
- **Dynamic Theming:** Choose from multiple color schemes to personalize the look and feel.
- **Modern UI:** A sleek "liquid glass" interface built with Tailwind CSS.
- **Extensible:** A simple architecture for creating and adding your own custom widgets.

## Tech Stack

- **Frontend:** React, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Linting:** ESLint

## Prerequisites

- Node.js (v18 or newer recommended)
- npm (or your preferred package manager like yarn or pnpm)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Dash
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Application

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

This will start the development server, and you can view the application by navigating to `http://localhost:5173` (the port may vary).

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the source code using ESLint.
- `npm run preview`: Starts a local server to preview the production build.

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts for global state
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── widgets/         # Widget components and configurations
│   │   ├── base/        # Core widgets
│   │   └── custom/      # User-created widgets
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
``` 