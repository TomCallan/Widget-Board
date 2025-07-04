# Contributing to Widget Board

Thank you for your interest in contributing to Widget Board! This guide will help you get started with contributing to our dashboard platform.

## 📚 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contributing Guidelines](#contributing-guidelines)
- [Widget Development](#widget-development)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## 🤝 Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 7.0.0 or higher
- **Git** for version control
- Modern IDE (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/widget-board.git
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

4. **Verify setup**
   - Open http://localhost:5173
   - Check that all widgets load correctly
   - Verify console has no errors

### Recommended IDE Setup

**VS Code Extensions:**
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer

**Settings:**
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 🔄 Development Workflow

### Git Workflow

We use a **Git Flow** inspired workflow:

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 2. Make your changes
# ... develop your feature ...

# 3. Commit using conventional commits
git add .
git commit -m "feat: add new weather widget configuration options"

# 4. Push and create pull request
git push origin feature/your-feature-name
```

### Branch Naming

- **Features**: `feature/feature-name`
- **Bug fixes**: `fix/bug-description`
- **Documentation**: `docs/documentation-improvement`
- **Refactoring**: `refactor/component-name`
- **Performance**: `perf/optimization-description`

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(widgets): add currency converter widget
fix(dashboard): resolve widget overlap issue
docs(api): update widget development guide
refactor(hooks): simplify dashboard state management
```

## 📋 Contributing Guidelines

### Pull Request Process

1. **Before creating a PR:**
   - Ensure your code follows our style guidelines
   - Run linting: `npm run lint`
   - Test your changes thoroughly
   - Update documentation if needed

2. **PR Requirements:**
   - Clear, descriptive title
   - Detailed description of changes
   - Link to relevant issues
   - Screenshots/videos for UI changes
   - Test plan description

3. **PR Template:**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement
   
   ## Testing
   - [ ] Tested locally
   - [ ] Added/updated tests
   - [ ] All existing tests pass
   
   ## Screenshots/Videos
   (If applicable)
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes (or marked as such)
   ```

### Code Style Guidelines

#### TypeScript/React

```typescript
// ✅ Good: Descriptive component name and props interface
interface WeatherWidgetProps extends WidgetProps {
  config: WeatherConfig;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ widget, onUpdate }) => {
  // ✅ Good: Destructure config for readability
  const { apiKey, city, units } = widget.config;
  
  // ✅ Good: Proper error state handling
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // ✅ Good: Memoized expensive calculations
  const processedData = useMemo(() => {
    return processWeatherData(rawData);
  }, [rawData]);
  
  // ✅ Good: Proper cleanup
  useEffect(() => {
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="h-full p-4 space-y-4">
      {/* Component JSX */}
    </div>
  );
};

// ✅ Good: Explicit export with descriptive config
export const weatherWidgetConfig: WidgetConfig = {
  type: 'weather',
  name: 'Weather',
  // ... configuration
};
```

#### CSS/Tailwind

```typescript
// ✅ Good: Use theme-aware classes
<div className="bg-accent-900 border border-accent-700 text-accent-100">
  
// ✅ Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ✅ Good: Consistent spacing
<div className="p-4 space-y-4">

// ❌ Avoid: Hardcoded colors
<div className="bg-purple-900 text-purple-100">
```

#### File Organization

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components
│   └── ComponentName.tsx
├── widgets/             # Widget ecosystem
│   ├── base/           # Core widgets
│   └── custom/         # User widgets
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

### Widget Development Standards

#### Widget Structure

```typescript
// Required: Component implementation
const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate, onRemove }) => {
  // Widget logic here
};

// Required: Configuration export
export const myWidgetConfig: WidgetConfig = {
  type: 'my-widget',              // Required: Unique type
  name: 'My Widget',              // Required: Display name
  description: 'Widget description', // Required: Description
  version: '1.0.0',               // Required: Semantic version
  component: MyWidget,            // Required: React component
  icon: WidgetIcon,              // Required: Lucide React icon
  defaultSize: { width: 250, height: 200 }, // Required
  minSize: { width: 200, height: 150 },     // Required
  maxSize: { width: 400, height: 300 },     // Required
  categories: ['Category'],       // Optional: For organization
  tags: ['tag1', 'tag2'],        // Optional: For search
  author: {                      // Optional: Author info
    name: 'Your Name',
    email: 'your@email.com'
  }
};
```

#### Widget Best Practices

```typescript
// ✅ Good: Proper error handling
const MyWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [error, setError] = useState<string | null>(null);
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
        <p>{error}</p>
        <button 
          onClick={() => setError(null)}
          className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }
  
  // ✅ Good: Loading state
  if (loading) {
    return (
      <div className="p-4 text-center text-white/70">
        <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }
  
  // ✅ Good: Persist state changes
  const handleConfigChange = (updates: Partial<typeof widget.config>) => {
    onUpdate(widget.id, {
      ...widget,
      config: { ...widget.config, ...updates }
    });
  };
  
  return (
    <div className="h-full p-4">
      {/* Widget content */}
    </div>
  );
};
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Guidelines

#### Unit Tests

```typescript
// tests/components/MyWidget.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyWidget } from '../src/widgets/MyWidget';

describe('MyWidget', () => {
  const mockWidget = {
    id: 'test-widget',
    type: 'my-widget',
    config: { message: 'Hello World' },
    // ... other required properties
  };
  
  const mockOnUpdate = jest.fn();
  const mockOnRemove = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders widget content correctly', () => {
    render(
      <MyWidget 
        widget={mockWidget}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
  
  it('updates configuration when settings change', () => {
    render(
      <MyWidget 
        widget={mockWidget}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    expect(mockOnUpdate).toHaveBeenCalledWith(
      'test-widget',
      expect.objectContaining({
        config: expect.objectContaining({
          // expected config changes
        })
      })
    );
  });
});
```

#### Integration Tests

```typescript
// tests/integration/dashboard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../src/App';

describe('Dashboard Integration', () => {
  it('allows adding and configuring widgets', async () => {
    render(<App />);
    
    // Right-click to open context menu
    fireEvent.contextMenu(screen.getByRole('main'));
    
    // Add widget
    fireEvent.click(screen.getByText('Add Widget'));
    
    // Select widget type
    fireEvent.click(screen.getByText('Weather Widget'));
    
    // Verify widget appears
    expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
  });
});
```

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Widget loads without errors
- [ ] Configuration dialog opens and saves correctly
- [ ] Widget resizes properly within min/max constraints
- [ ] Widget persists state across page refreshes
- [ ] Widget works in fullscreen mode
- [ ] Widget respects all color schemes
- [ ] Widget is responsive on different screen sizes
- [ ] Widget handles errors gracefully

## 📖 Documentation

### Documentation Standards

- Use clear, concise language
- Include code examples for APIs
- Add screenshots for UI features
- Keep documentation up-to-date with code changes
- Follow markdown best practices

### Documentation Types

#### Code Documentation

```typescript
/**
 * Custom hook for managing dashboard state and operations
 * 
 * @returns Object containing dashboard state and manipulation functions
 * 
 * @example
 * ```typescript
 * const { currentDashboard, handleAddWidget } = useDashboards();
 * 
 * // Add a new weather widget
 * handleAddWidget('weather');
 * ```
 */
export function useDashboards() {
  // Implementation
}
```

#### README Updates

When adding new features:
1. Update feature list in main README
2. Add usage examples
3. Update screenshots if UI changes
4. Update installation instructions if needed

#### API Documentation

When adding new APIs:
1. Document in `docs/API_REFERENCE.md`
2. Include TypeScript signatures
3. Provide usage examples
4. Document error conditions

## 👥 Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Requests**: Code reviews and discussions

### Getting Help

1. **Check existing documentation** in the `/docs` folder
2. **Search existing issues** for similar problems
3. **Create a new issue** with detailed information
4. **Join discussions** for general questions

### Reporting Bugs

Use this template for bug reports:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Widget Board Version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem
```

### Feature Requests

Use this template for feature requests:

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed? What problem does it solve?

**Proposed Solution**
How would you like this feature to work?

**Alternatives Considered**
What other approaches have you considered?

**Additional Context**
Any other context, mockups, or examples
```

## 🏆 Recognition

### Contributors

All contributors will be recognized in:
- README contributors section
- CHANGELOG for significant contributions
- GitHub releases for major features

### Contributor Levels

- **First-time contributors**: Welcome with detailed feedback
- **Regular contributors**: Invited to review others' PRs
- **Core contributors**: Given repository write access
- **Maintainers**: Full repository administration rights

## 📋 Contribution Checklist

Before submitting your contribution:

### Code Contribution
- [ ] Fork repository and create feature branch
- [ ] Follow coding standards and conventions
- [ ] Add/update tests for your changes
- [ ] Update documentation if needed
- [ ] Ensure all tests pass
- [ ] Create clear, descriptive pull request

### Widget Contribution
- [ ] Widget follows development guidelines
- [ ] Widget config is properly exported
- [ ] Widget handles errors gracefully
- [ ] Widget is responsive and theme-aware
- [ ] Widget includes proper TypeScript types
- [ ] Widget documentation is updated

### Documentation Contribution
- [ ] Content is clear and accurate
- [ ] Code examples are tested
- [ ] Screenshots are up-to-date
- [ ] Markdown follows project style
- [ ] Links are working correctly

---

**Thank you for contributing to Widget Board! 🎉**

*Your contributions help make this project better for everyone. We appreciate your time and effort!* 