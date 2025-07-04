# Widget Board

A powerful, customizable dashboard application built with modern web technologies. Create beautiful, interactive dashboards with a rich ecosystem of widgets and seamless user experience.

![Widget Board Banner](https://img.shields.io/badge/Widget%20Board-Dashboard%20Platform-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff)

## ✨ Features

### 🎛️ **Rich Widget Ecosystem**
- **18+ Built-in Widgets**: Weather, Calendar, Todo, Notes, Calculator, Clock, Stock Ticker, GitHub Activity, and more
- **Custom Widget Support**: Create your own widgets with our comprehensive development framework
- **Smart Configurations**: Each widget comes with customizable settings and preferences

### 🎨 **Beautiful UI/UX**
- **Liquid Glass Design**: Modern, elegant interface with smooth animations
- **Dynamic Color Schemes**: 5 beautiful color themes (Purple Dream, Ocean Depths, Forest Night, Sunset Glow, Golden Hour)
- **Responsive Layout**: Fluid grid system that adapts to any screen size
- **Context Menus**: Right-click anywhere for quick actions and navigation

### 📊 **Multi-Dashboard Management**
- **Unlimited Dashboards**: Create and manage multiple dashboards for different workflows
- **Dashboard Tabs**: Easy switching between dashboards with visual indicators
- **Export/Import**: Backup and share your dashboard configurations

### 🔧 **Advanced Features**
- **Widget Resizing**: Drag to resize widgets to fit your needs
- **Fullscreen Mode**: Focus on individual widgets in fullscreen view
- **Notification System**: Toast, sound, and desktop notifications
- **Authentication Management**: Secure API key storage for external services
- **Settings Panel**: Comprehensive customization options

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: latest LTS)
- **npm** 7+ or **yarn** 1.22+
- Modern web browser with ES2020 support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/widget-board.git
   cd widget-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run lint` | Run ESLint code analysis |
| `npm run preview` | Preview production build locally |

## 🧩 Built-in Widgets

### **Productivity**
- 📝 **Notes Widget** - Rich markdown note-taking with syntax highlighting
- ✅ **Todo Widget** - Task management with priorities and categories
- ⏰ **Pomodoro Timer** - Focus timer with customizable intervals
- 📅 **Calendar Widget** - Monthly calendar view with event highlights

### **Information & Monitoring**
- 🌤️ **Weather Widget** - Real-time weather with 5-day forecast
- 📈 **Stock Ticker** - Live stock prices and market data
- 💻 **System Monitor** - CPU, memory, and performance metrics
- 🌍 **World Time** - Multiple timezone clock display

### **Tools & Utilities**
- 🧮 **Calculator** - Full-featured calculator with history
- 🔐 **Password Generator** - Secure password creation tool
- 💱 **Currency Converter** - Real-time exchange rates
- 🔗 **Quick Links** - Bookmarks and favorite links manager

### **Content & Social**
- 📰 **RSS Feed Reader** - Stay updated with your favorite feeds
- 🐙 **GitHub Activity** - Track repository activity and contributions
- 🏃 **Habit Tracker** - Build and maintain daily habits
- 🌬️ **Air Quality Index** - Monitor local air quality levels

### **Time & Scheduling**
- 🕐 **Clock Widget** - Customizable analog/digital clock
- ⏳ **Countdown Timer** - Event countdown with notifications

## 🏗️ Project Structure

```
widget-board/
├── 📁 src/
│   ├── 📁 components/          # Reusable UI components
│   │   ├── AuthKeySelect.tsx   # API key management
│   │   ├── WidgetContainer.tsx # Widget wrapper & controls
│   │   ├── WidgetSelector.tsx  # Widget picker dialog
│   │   └── common/             # Shared components
│   ├── 📁 contexts/            # React contexts
│   │   ├── NotificationContext.tsx
│   │   └── SettingsContext.tsx
│   ├── 📁 hooks/               # Custom React hooks
│   │   ├── useLocalStorage.ts  # Persistent storage
│   │   ├── useDashboards.ts    # Dashboard management
│   │   └── useWidgetNotifications.ts
│   ├── 📁 types/               # TypeScript definitions
│   │   ├── widget.ts           # Widget interfaces
│   │   └── settings.ts         # Settings interfaces
│   ├── 📁 widgets/             # Widget ecosystem
│   │   ├── base/               # Built-in widgets
│   │   ├── custom/             # User-created widgets
│   │   └── index.ts            # Widget registry
│   └── App.tsx                 # Main application
├── 📁 docs/                    # Documentation
└── 📋 Configuration files
```

## 🎨 Customization

### Color Schemes

Widget Board includes 5 beautiful color schemes:

- **Purple Dream** - Deep purples with elegant gradients
- **Ocean Depths** - Cool blues reminiscent of deep waters  
- **Forest Night** - Rich greens with natural tones
- **Sunset Glow** - Warm roses and pinks
- **Golden Hour** - Vibrant ambers and golds

Switch themes via right-click context menu → "Change Colour Scheme"

### Widget Configuration

Each widget can be customized through its configuration panel:

1. **Hover over any widget** → Click the settings (⚙️) icon
2. **Modify settings** in the configuration dialog
3. **Save changes** to apply immediately

### Dashboard Management

- **Create**: Right-click → "Create Dashboard"
- **Switch**: Right-click → "Switch Tab"
- **Rename**: Right-click → "Rename Current Dashboard"
- **Delete**: Right-click → "Delete Current Dashboard"

## 🔧 Development

### Creating Custom Widgets

Widget Board supports custom widget development. See our [Widget Development Guide](docs/WIDGET_DEVELOPMENT.md) for comprehensive documentation.

**Quick Example:**
```typescript
import React from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Heart } from 'lucide-react';

const MyCustomWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  return (
    <div className="p-4 h-full flex items-center justify-center">
      <h3 className="text-xl text-accent-500">Hello Widget!</h3>
    </div>
  );
};

export const myCustomWidgetConfig: WidgetConfig = {
  type: 'custom-hello',
  name: 'Hello Widget',
  description: 'A simple custom widget example',
  version: '1.0.0',
  component: MyCustomWidget,
  icon: Heart,
  defaultSize: { width: 200, height: 150 },
  minSize: { width: 150, height: 100 },
  maxSize: { width: 400, height: 300 },
  categories: ['Custom'],
};
```

### Notification System

Widgets can send notifications to users:

```typescript
import { useWidgetNotifications } from '../../hooks/useWidgetNotifications';

const { sendNotification } = useWidgetNotifications(widgetConfig);

// Send notification
sendNotification('Task completed!', {
  type: 'success',
  duration: 5000
});
```

See [Notification System Documentation](docs/NOTIFICATIONS.md) for details.

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Add TypeScript types for all new code
- Test widgets in different sizes and color schemes
- Update documentation for new features
- Use semantic commit messages

## 📋 Requirements

- **Node.js** 18.0.0 or higher
- **Modern browser** with ES2020 support
- **2GB RAM** minimum (4GB recommended)
- **1920x1080** screen resolution recommended

## 🔄 Version History

- **v1.0.0** - Initial release with core widget ecosystem
- **v0.9.0** - Beta release with notification system
- **v0.8.0** - Alpha release with basic dashboard functionality

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions for help and ideas

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the incredible React framework
- **Vite** - For lightning-fast development experience
- **Tailwind CSS** - For utility-first styling approach
- **Lucide React** - For beautiful, consistent icons
- **Community Contributors** - For making this project better

---

**Built with ❤️ by the Widget Board team**

*Transform your browsing experience with the ultimate customizable dashboard* 