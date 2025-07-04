# Deployment Guide

Complete guide for deploying Widget Board to various platforms and environments.

## 📚 Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Deployment Options](#deployment-options)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### System Requirements

**Development Environment:**
- Node.js 18.0.0 or higher
- npm 7.0.0 or higher (or yarn 1.22+)
- Modern browser with ES2020 support
- 4GB RAM minimum (8GB recommended)

**Production Environment:**
- Web server (Nginx, Apache, or CDN)
- HTTPS certificate (recommended)
- Gzip compression support
- Modern browser support (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

### Build Dependencies

```bash
# Install all dependencies
npm install

# Verify build tools
npm run lint
npm run build
```

## 🏗️ Build Process

### Development Build

```bash
# Start development server
npm run dev

# Development server runs on http://localhost:5173
# Features hot-reload and development tools
```

### Production Build

```bash
# Create optimized production build
npm run build

# Output directory: dist/
# Build includes:
# - Minified JavaScript and CSS
# - Optimized assets
# - Source maps (optional)
# - Service worker (if configured)
```

### Build Verification

```bash
# Preview production build locally
npm run preview

# Test production build
# - Verify all widgets load correctly
# - Test responsive design
# - Check performance metrics
```

### Build Optimization

**Vite Configuration (`vite.config.ts`):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,  // Disable for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
          utils: ['lodash']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
```

## 🚀 Deployment Options

### 1. Static Site Hosting

#### Netlify Deployment

1. **Build Settings:**
   ```yaml
   # netlify.toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy Process:**
   ```bash
   # Connect repository to Netlify
   # Configure build settings
   # Deploy automatically on push
   ```

#### Vercel Deployment

1. **Configuration:**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

2. **Deploy:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

#### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 2. Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  widget-board:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
```

### 3. Cloud Platform Deployment

#### AWS S3 + CloudFront

```bash
# Build application
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### Google Cloud Storage

```bash
# Build application
npm run build

# Upload to GCS
gsutil -m rsync -r -d dist/ gs://your-bucket-name

# Set public access
gsutil web set -m index.html -e index.html gs://your-bucket-name
```

#### Azure Static Web Apps

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
          app_build_command: "npm run build"
```

## 🔧 Environment Configuration

### Environment Variables

```bash
# .env.production
VITE_APP_TITLE="Widget Board"
VITE_APP_VERSION="1.0.0"
VITE_API_BASE_URL=""
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=""
```

### Runtime Configuration

```typescript
// src/config/index.ts
export const config = {
  app: {
    title: import.meta.env.VITE_APP_TITLE || 'Widget Board',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    sentry: Boolean(import.meta.env.VITE_SENTRY_DSN),
  },
};
```

### Custom Build Configuration

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            if (id.includes('widgets/')) {
              return 'widgets';
            }
          }
        }
      }
    }
  };
});
```

## ⚡ Performance Optimization

### Bundle Optimization

```typescript
// Dynamic widget loading
const LazyWidget = React.lazy(() => import('./widgets/CustomWidget'));

// Code splitting by route
const SettingsDialog = React.lazy(() => import('./components/SettingsDialog'));
```

### Asset Optimization

```bash
# Optimize images before build
npm install -D imagemin imagemin-webp

# Compress assets
npm install -D vite-plugin-compress
```

### Service Worker (Optional)

```typescript
// src/sw.ts
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Precache app shell
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
  })
);
```

### Performance Monitoring

```typescript
// src/utils/performance.ts
export const measurePerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    console.log({
      'DOM Content Loaded': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      'Load Complete': navigation.loadEventEnd - navigation.loadEventStart,
      'First Paint': performance.getEntriesByName('first-paint')[0]?.startTime,
      'First Contentful Paint': performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    });
  }
};
```

## 🔒 Security Considerations

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https:;
  font-src 'self';
  media-src 'self';
  worker-src 'self';
">
```

### API Key Security

```typescript
// Secure API key storage
const ENCRYPTION_KEY = 'your-encryption-key';

export const encryptApiKey = (key: string): string => {
  // Implement encryption
  return btoa(key); // Simple base64 (use proper encryption in production)
};

export const decryptApiKey = (encryptedKey: string): string => {
  // Implement decryption
  return atob(encryptedKey);
};
```

### HTTPS Configuration

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)

```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/react';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing(),
    ],
    tracesSampleRate: 0.1,
  });
}
```

### Analytics Integration

```typescript
// src/utils/analytics.ts
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS) {
    // Google Analytics 4
    if ('gtag' in window) {
      (window as any).gtag('event', event, properties);
    }
    
    // Custom analytics
    console.log('Analytics Event:', event, properties);
  }
};

// Usage
trackEvent('widget_added', { type: 'weather' });
trackEvent('dashboard_created', { scheme: 'purple' });
```

### Health Checks

```typescript
// src/utils/healthCheck.ts
export const healthCheck = async (): Promise<boolean> => {
  try {
    // Check localStorage availability
    localStorage.setItem('health-check', 'ok');
    localStorage.removeItem('health-check');
    
    // Check if critical components load
    const criticalModules = await Promise.all([
      import('./contexts/SettingsContext'),
      import('./hooks/useDashboards'),
    ]);
    
    return criticalModules.every(module => module);
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
```

## 🐛 Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+

# Verbose build output
npm run build -- --verbose
```

#### Runtime Errors

```typescript
// Error boundary for production
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-4 text-center">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  );
}

// Wrap app
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <App />
</ErrorBoundary>
```

#### Performance Issues

```typescript
// Performance debugging
const debug = {
  logRenderTime: (componentName: string) => {
    console.time(`${componentName} render`);
    return () => console.timeEnd(`${componentName} render`);
  },
  
  logMemoryUsage: () => {
    if ('memory' in performance) {
      console.log('Memory usage:', (performance as any).memory);
    }
  },
  
  checkBundleSize: () => {
    console.log('Scripts loaded:', Array.from(document.scripts).length);
    console.log('Stylesheets loaded:', Array.from(document.styleSheets).length);
  }
};
```

### Debugging Production Issues

```typescript
// Production debugging utility
window.debugWidget = {
  // Log all widgets
  listWidgets: () => {
    const widgets = JSON.parse(localStorage.getItem('dashboards') || '[]');
    console.table(widgets);
  },
  
  // Check settings
  getSettings: () => {
    const settings = JSON.parse(localStorage.getItem('app-settings') || '{}');
    console.log(settings);
  },
  
  // Force refresh
  resetApp: () => {
    localStorage.clear();
    window.location.reload();
  }
};
```

### Log Aggregation

```typescript
// Centralized logging
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
    // Send to external service in production
  },
  
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // Report to error tracking service
  },
  
  performance: (metric: string, value: number) => {
    console.log(`[PERF] ${metric}: ${value}ms`);
    // Send to analytics service
  }
};
```

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] Run linting: `npm run lint`
- [ ] Run type checking: `tsc --noEmit`
- [ ] Test production build: `npm run build && npm run preview`
- [ ] Verify all widgets load correctly
- [ ] Test responsive design
- [ ] Check console for errors
- [ ] Validate accessibility

### Production Deployment

- [ ] Configure environment variables
- [ ] Set up SSL certificate
- [ ] Configure CDN (if applicable)
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Test error scenarios
- [ ] Verify performance metrics

### Post-Deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify analytics integration
- [ ] Test from different locations
- [ ] Monitor server resources
- [ ] Document deployment process

---

**Successfully deployed? 🎉**

*Monitor your deployment and refer to this guide for updates and troubleshooting.* 