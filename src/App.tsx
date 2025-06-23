import React, { useState, useEffect } from 'react';
import { Widget, Dashboard } from './types/widget';
import { WidgetContainer } from './components/WidgetContainer';
import { WidgetSelector } from './components/WidgetSelector';
import { DashboardTabs } from './components/DashboardTabs';
import { WIDGET_REGISTRY, initializeWidgets } from './widgets';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Plus, Settings, Palette, X } from 'lucide-react';
import { ColorScheme, COLOR_SCHEMES } from './types/widget';
import { WidgetConfigDialog } from './components/WidgetConfigDialog';

const DEFAULT_DASHBOARD: Dashboard = {
  id: '1',
  name: 'Main Dashboard',
  widgets: [
    {
      id: '1',
      type: 'clock',
      title: 'Clock',
      position: { x: 40, y: 40 },
      size: { width: 280, height: 160 },
      config: {},
      enabled: true
    },
    {
      id: '2',
      type: 'weather',
      title: 'Weather',
      position: { x: 340, y: 40 },
      size: { width: 280, height: 180 },
      config: {},
      enabled: true
    },
    {
      id: '3',
      type: 'todo',
      title: 'Tasks',
      position: { x: 40, y: 220 },
      size: { width: 320, height: 280 },
      config: {},
      enabled: true
    },
    {
      id: '4',
      type: 'notes',
      title: 'Notes',
      position: { x: 640, y: 40 },
      size: { width: 300, height: 280 },
      config: {},
      enabled: true
    }
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  colorScheme: 'purple'
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [widgetRegistry, setWidgetRegistry] = useState<typeof WIDGET_REGISTRY>({});
  const [dashboards, setDashboards] = useLocalStorage<Dashboard[]>('dashboards', [DEFAULT_DASHBOARD]);
  const [currentDashboardId, setCurrentDashboardId] = useLocalStorage<string>('current-dashboard-id', DEFAULT_DASHBOARD.id);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const [showColorSchemeSelector, setShowColorSchemeSelector] = useState(false);
  const [configWidget, setConfigWidget] = useState<Widget | null>(null);

  useEffect(() => {
    // Initialize widgets when the app starts
    initializeWidgets().then((registry) => {
      setWidgetRegistry(registry);
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to initialize widgets:', error);
      setIsLoading(false);
    });
  }, []);

  // Early return while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading widgets...</div>
      </div>
    );
  }

  const currentDashboard = dashboards.find(d => d.id === currentDashboardId) || dashboards[0];
  const scheme = COLOR_SCHEMES[currentDashboard.colorScheme] || COLOR_SCHEMES['purple'];

  const handlePositionChange = (id: string, position: { x: number; y: number }) => {
    setDashboards(dashboards.map(dashboard => {
      if (dashboard.id !== currentDashboardId) return dashboard;
      return {
        ...dashboard,
        widgets: dashboard.widgets.map(widget =>
          widget.id === id ? { ...widget, position } : widget
        ),
        updatedAt: Date.now()
      };
    }));
  };

  const handleSizeChange = (id: string, size: { width: number; height: number }) => {
    setDashboards(dashboards.map(dashboard => {
      if (dashboard.id !== currentDashboardId) return dashboard;
      return {
        ...dashboard,
        widgets: dashboard.widgets.map(widget =>
          widget.id === id ? { ...widget, size } : widget
        ),
        updatedAt: Date.now()
      };
    }));
  };

  const handleToggleFullscreen = (id: string) => {
    setDashboards(dashboards.map(dashboard => {
      if (dashboard.id !== currentDashboardId) return dashboard;
      return {
        ...dashboard,
        widgets: dashboard.widgets.map(widget => {
          if (widget.id !== id) return widget;
          
          if (!widget.isFullscreen) {
            return {
              ...widget,
              isFullscreen: true,
              savedState: {
                position: { ...widget.position },
                size: { ...widget.size }
              }
            };
          } else {
            return {
              ...widget,
              isFullscreen: false,
              position: widget.savedState?.position || widget.position,
              size: widget.savedState?.size || widget.size,
              savedState: undefined
            };
          }
        }),
        updatedAt: Date.now()
      };
    }));
  };

  const handleRemoveWidget = (id: string) => {
    setDashboards(dashboards.map(dashboard => {
      if (dashboard.id !== currentDashboardId) return dashboard;
      return {
        ...dashboard,
        widgets: dashboard.widgets.filter(widget => widget.id !== id),
        updatedAt: Date.now()
      };
    }));
  };

  const handleUpdateWidget = (id: string, updates: Partial<Widget>) => {
    setDashboards(dashboards.map(dashboard => {
      if (dashboard.id !== currentDashboardId) return dashboard;
      return {
        ...dashboard,
        widgets: dashboard.widgets.map(widget =>
          widget.id === id ? { ...widget, ...updates } : widget
        ),
        updatedAt: Date.now()
      };
    }));
  };

  const handleAddWidget = (type: string) => {
    const config = WIDGET_REGISTRY[type];
    if (!config) return;

    const newWidget: Widget = {
      id: crypto.randomUUID(),
      type,
      title: config.name,
      position: { x: 20, y: 20 },
      size: config.defaultSize,
      config: {},
      enabled: true
    };

    setDashboards(dashboards.map(dashboard => {
      if (dashboard.id !== currentDashboardId) return dashboard;
      return {
        ...dashboard,
        widgets: [...dashboard.widgets, newWidget],
        updatedAt: Date.now()
      };
    }));

    setShowWidgetSelector(false);
  };

  const handleDashboardAdd = () => {
    const newDashboard: Dashboard = {
      id: Date.now().toString(),
      name: `Dashboard ${dashboards.length + 1}`,
      widgets: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      colorScheme: Object.keys(COLOR_SCHEMES)[0]
    };
    setDashboards([...dashboards, newDashboard]);
    setCurrentDashboardId(newDashboard.id);
  };

  const handleDashboardRename = (dashboard: Dashboard, newName: string) => {
    setDashboards(dashboards.map(d => 
      d.id === dashboard.id 
        ? { ...d, name: newName, updatedAt: Date.now() } 
        : d
    ));
  };

  const handleDashboardDelete = (dashboard: Dashboard) => {
    if (dashboards.length <= 1) return;
    
    setDashboards(dashboards.filter(d => d.id !== dashboard.id));
    if (currentDashboardId === dashboard.id) {
      const remainingDashboard = dashboards.find(d => d.id !== dashboard.id);
      if (remainingDashboard) {
        setCurrentDashboardId(remainingDashboard.id);
      }
    }
  };

  const handleColorSchemeChange = (newScheme: string) => {
    if (!COLOR_SCHEMES[newScheme]) return;
    
    setDashboards(dashboards.map(dashboard =>
      dashboard.id === currentDashboardId
        ? { ...dashboard, colorScheme: newScheme, updatedAt: Date.now() }
        : dashboard
    ));
    setShowColorSchemeSelector(false);
  };

  const handleConfigureWidget = (id: string) => {
    const widget = currentDashboard.widgets.find(w => w.id === id);
    if (widget) {
      setConfigWidget(widget);
    }
  };

  const handleSaveConfig = (id: string, config: Record<string, any>) => {
    handleUpdateWidget(id, { config });
    setConfigWidget(null);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scheme.from} ${scheme.via} ${scheme.to} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%223%22%20cy=%223%22%20r=%221%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      {/* Grid overlay for visual feedback */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Header */}
      <header className="relative z-20">
        <DashboardTabs
          dashboards={dashboards}
          currentDashboard={currentDashboard}
          onDashboardChange={(dashboard) => setCurrentDashboardId(dashboard.id)}
          onDashboardAdd={handleDashboardAdd}
          onDashboardRename={handleDashboardRename}
          onDashboardDelete={handleDashboardDelete}
        />

        <div className="flex items-center justify-end gap-3 px-6 py-3">
          <button
            onClick={() => setShowWidgetSelector(true)}
            className={`flex items-center gap-2 px-4 py-2 bg-${scheme.accentColor}-600 hover:bg-${scheme.accentColor}-700 text-white rounded-lg transition-colors duration-200`}
          >
            <Plus size={18} />
            Add Widget
          </button>
          <button 
            onClick={() => setShowColorSchemeSelector(true)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Palette size={20} />
          </button>
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <main className="dashboard relative z-10 px-6 pb-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {currentDashboard.widgets.map(widget => {
          const config = widgetRegistry[widget.type];
          if (!config) return null;

          const WidgetComponent = config.component;

          return (
            <WidgetContainer
              key={widget.id}
              widget={widget}
              widgetConfig={config}
              onPositionChange={handlePositionChange}
              onSizeChange={handleSizeChange}
              onToggleFullscreen={handleToggleFullscreen}
              onRemove={handleRemoveWidget}
              onConfigureWidget={handleConfigureWidget}
            >
              <WidgetComponent
                widget={widget}
                onUpdate={handleUpdateWidget}
                onRemove={handleRemoveWidget}
                onResize={handleSizeChange}
                onToggleFullscreen={handleToggleFullscreen}
              />
            </WidgetContainer>
          );
        })}

        {currentDashboard.widgets.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Plus className="mx-auto mb-4 text-white/30" size={48} />
              <p className="text-white/50 mb-4">No widgets added yet</p>
              <button
                onClick={() => setShowWidgetSelector(true)}
                className={`px-4 py-2 bg-${scheme.accentColor}-600 hover:bg-${scheme.accentColor}-700 text-white rounded-lg transition-colors`}
              >
                Add Your First Widget
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Widget Selector */}
      <WidgetSelector
        isOpen={showWidgetSelector}
        onClose={() => setShowWidgetSelector(false)}
        onAddWidget={handleAddWidget}
      />

      {/* Color Scheme Selector Modal */}
      {showColorSchemeSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800/90 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Choose Theme</h2>
              <button
                onClick={() => setShowColorSchemeSelector(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                <button
                  key={key}
                  onClick={() => handleColorSchemeChange(key)}
                  className={`p-4 rounded-lg transition-all duration-200 hover:scale-105 text-left group flex items-center justify-between
                    ${currentDashboard.colorScheme === key ? `bg-${scheme.accentColor}-500/20` : 'bg-white/10'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${scheme.from} ${scheme.via} ${scheme.to}`} />
                    <span className="text-white font-medium">{scheme.name}</span>
                  </div>
                  {currentDashboard.colorScheme === key && (
                    <div className={`w-2 h-2 rounded-full bg-${scheme.accentColor}-400`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Configuration Dialog */}
      {configWidget && (
        <WidgetConfigDialog
          widget={configWidget}
          widgetConfig={WIDGET_REGISTRY[configWidget.type]}
          onClose={() => setConfigWidget(null)}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
}

export default App;