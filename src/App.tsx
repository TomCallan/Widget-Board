import React, { useState, useEffect } from 'react';
import { Widget } from './types/widget';
import { WidgetContainer } from './components/WidgetContainer';
import { WidgetSelector } from './components/WidgetSelector';
import { DashboardTabs } from './components/DashboardTabs';
import { WIDGET_REGISTRY, initializeWidgets } from './widgets';
import { Plus, X } from 'lucide-react';
import { WidgetConfigDialog } from './components/WidgetConfigDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { useSettings } from './contexts/SettingsContext';
import { useDashboards } from './hooks/useDashboards';
import { COLOR_SCHEMES } from './types/widget';
import { ColorSchemeDialog } from './components/ColorSchemeDialog';
import { useApplySettings } from './hooks/useApplySettings';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from './components/common/ContextMenu';

function App() {
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [widgetRegistry, setWidgetRegistry] = useState<typeof WIDGET_REGISTRY>({});
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const [showColorSchemeSelector, setShowColorSchemeSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [configWidget, setConfigWidget] = useState<Widget | null>(null);

  const {
    dashboards,
    currentDashboard,
    setCurrentDashboardId,
    scheme,
    handlePositionChange,
    handleSizeChange,
    handleToggleFullscreen,
    handleRemoveWidget,
    handleUpdateWidget,
    handleAddWidget,
    handleDashboardAdd,
    handleDashboardRename,
    handleDashboardDelete,
    handleColorSchemeChange,
    handleCloseAllTabs,
    handleCloseTabsToRight,
    handleToggleTabLock,
  } = useDashboards();

  useApplySettings(scheme);

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

  const handleConfigureWidget = (id: string) => {
    const widget = currentDashboard.widgets.find(w => w.id === id);
    if (widget) {
      setConfigWidget(widget);
    }
  };

  const onColorSchemeChange = (newScheme: string) => {
    handleColorSchemeChange(newScheme);
  };

  const onAddWidget = (type: string) => {
    handleAddWidget(type);
    setShowWidgetSelector(false);
  };

  // Early return while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading widgets...</div>
      </div>
    );
  }

  return (
    <div 
      className={`app min-h-screen bg-gradient-to-br ${scheme.from} ${scheme.via} ${scheme.to}`}
      style={{
        '--grid-opacity': settings.general.showWidgetGrid ? '0.05' : '0',
      } as React.CSSProperties}
    >
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
          onAddWidget={() => setShowWidgetSelector(true)}
          onStyleClick={() => setShowColorSchemeSelector(true)}
          onSettingsClick={() => setShowSettings(true)}
          onCloseAllTabs={handleCloseAllTabs}
          onCloseTabsToRight={handleCloseTabsToRight}
          onToggleTabLock={handleToggleTabLock}
        />
      </header>

      {/* Dashboard */}
      <ContextMenu>
        <ContextMenuTrigger>
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
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-white rounded-lg transition-colors duration-200"
                  >
                    <Plus size={18} className="mr-1" />
                    Add Your First Widget
                  </button>
                </div>
              </div>
            )}
          </main>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setShowWidgetSelector(true)}>
            <Plus size={14} className="mr-2" />
            Add Widget
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleDashboardAdd}>
            Create Dashboard
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              Switch Tab
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuRadioGroup 
                value={currentDashboard.id}
                onValueChange={(id) => setCurrentDashboardId(id)}
              >
                {dashboards.map(dashboard => (
                  <ContextMenuRadioItem key={dashboard.id} value={dashboard.id}>
                    {dashboard.name}
                  </ContextMenuRadioItem>
                ))}
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setShowSettings(true)}>
            Settings
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setShowColorSchemeSelector(true)}>
            Change Colour Scheme
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Widget Selector */}
      <WidgetSelector
        isOpen={showWidgetSelector}
        onClose={() => setShowWidgetSelector(false)}
        onAddWidget={onAddWidget}
      />

      {/* Color Scheme Selector Modal */}
      <ColorSchemeDialog
        isOpen={showColorSchemeSelector}
        onClose={() => setShowColorSchemeSelector(false)}
        onColorSchemeChange={onColorSchemeChange}
        currentScheme={currentDashboard.colorScheme}
      />

      {/* Configuration Dialog */}
      {configWidget && (
        <WidgetConfigDialog
          widget={configWidget}
          config={WIDGET_REGISTRY[configWidget.type]}
          onClose={() => setConfigWidget(null)}
          onUpdate={handleUpdateWidget}
        />
      )}

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;