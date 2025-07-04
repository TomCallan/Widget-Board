import React, { useState, useEffect } from 'react';
import { Widget } from './types/widget';
import { WidgetContainer } from './components/WidgetContainer';
import { WidgetSelector } from './components/WidgetSelector';
import { WIDGET_REGISTRY, initializeWidgets } from './widgets';
import { Plus, X, Edit2 } from 'lucide-react';
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
      className={`h-screen w-screen overflow-hidden bg-gradient-to-br ${scheme.from} ${scheme.via} ${scheme.to}`}
      style={{
        '--grid-opacity': settings.general.showWidgetGrid ? '0.05' : '0',
      } as React.CSSProperties}
    >
      {/* Dashboard */}
      <ContextMenu>
        <ContextMenuTrigger>
          <main className="dashboard h-full w-full p-6 overflow-auto">
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
                {dashboards.map(dashboard => {
                  const tabScheme = COLOR_SCHEMES[dashboard.colorScheme] || COLOR_SCHEMES['purple'];
                  const isSelected = dashboard.id === currentDashboard.id;
                  return (
                    <ContextMenuRadioItem 
                      key={dashboard.id} 
                      value={dashboard.id} 
                      className={`flex items-center gap-2 pl-2 ${isSelected ? 'bg-white/10' : ''}`}
                    >
                      <div className={`w-1 h-6 rounded-sm bg-gradient-to-b ${tabScheme.from} ${tabScheme.via} ${tabScheme.to}`} />
                      <span className={isSelected ? 'font-medium' : ''}>{dashboard.name}</span>
                      {isSelected && (
                        <div className="ml-auto flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newName = prompt('Enter new name:', dashboard.name);
                              if (newName && newName.trim()) {
                                handleDashboardRename(dashboard, newName.trim());
                              }
                            }}
                            className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                    </ContextMenuRadioItem>
                  );
                })}
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem onClick={() => {
            const newName = prompt('Enter new name:', currentDashboard.name);
            if (newName && newName.trim()) {
              handleDashboardRename(currentDashboard, newName.trim());
            }
          }}>
            Rename Current Dashboard
          </ContextMenuItem>
          {dashboards.length > 1 && (
            <ContextMenuItem onClick={() => handleDashboardDelete(currentDashboard)} className="text-red-400 hover:text-red-300">
              Delete Current Dashboard
            </ContextMenuItem>
          )}
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