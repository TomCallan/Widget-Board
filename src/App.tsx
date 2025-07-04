import React, { useState, useEffect } from 'react';
import { Widget } from './types/widget';
import { WidgetContainer } from './components/WidgetContainer';
import { WidgetSelector } from './components/WidgetSelector';
import { WIDGET_REGISTRY, initializeWidgets } from './widgets';
import { Plus, X, Edit2 } from 'lucide-react';
import { WidgetConfigDialog } from './components/WidgetConfigDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { useSettings } from './contexts/SettingsContext';
import { useUnifiedDashboards } from './hooks/useUnifiedDashboards';
import { useStorageMode } from './contexts/StorageModeContext';
import { StorageModeSelector } from './components/StorageModeSelector';
import { COLOR_SCHEMES } from './types/widget';
import { ColorSchemeDialog } from './components/ColorSchemeDialog';
import { useApplySettings } from './hooks/useApplySettings';
import { useAuth } from './contexts/AuthContext';
import { DashboardSharingDialog } from './components/DashboardSharingDialog';
import { UserProfile } from './components/UserProfile';
import { useDashboardUrl } from './hooks/useDashboardUrl';
import { shouldRequireAuth, isWebEnvironment } from './utils/environment';
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
  const { user, loading: authLoading, signInWithGitHub, signOut } = useAuth();
  const { storageMode } = useStorageMode();
  const { settings } = useSettings();
  const { updateBrowserUrl, getCurrentDashboardUrl } = useDashboardUrl();
  const [isLoading, setIsLoading] = useState(true);
  const [widgetRegistry, setWidgetRegistry] = useState<typeof WIDGET_REGISTRY>({});
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const [showColorSchemeSelector, setShowColorSchemeSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSharingDialog, setShowSharingDialog] = useState(false);
  const [showStorageModeSelector, setShowStorageModeSelector] = useState(false);
  const [configWidget, setConfigWidget] = useState<Widget | null>(null);

  const {
    dashboards,
    currentDashboard,
    setCurrentDashboardId,
    scheme,
    loading: dashboardLoading,
    error: dashboardError,
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
    handleToggleTabLock,
  } = useUnifiedDashboards();

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

  // Update browser URL when current dashboard changes
  useEffect(() => {
    if (currentDashboard && user && storageMode === 'cloud') {
      updateBrowserUrl(currentDashboard);
    }
  }, [currentDashboard, user, storageMode, updateBrowserUrl]);

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

  // Early return while loading auth, widgets, or dashboards
  if (authLoading || isLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">
          {authLoading 
            ? 'Checking authentication...' 
            : dashboardLoading 
            ? 'Loading dashboards...'
            : 'Loading widgets...'}
        </div>
      </div>
    );
  }

  // Show error if there's a dashboard error
  if (dashboardError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading dashboards</div>
          <div className="text-white text-sm mb-4">{dashboardError}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated and using cloud mode OR if web environment requires auth
  if (!user && (storageMode === 'cloud' || shouldRequireAuth())) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl border border-white/20 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Widget Board</h1>
            <p className="text-white/80 mb-8">
              Create and customize your personalized dashboard with widgets
              {isWebEnvironment() && (
                <><br /><span className="text-sm text-white/60">Web version requires authentication for data persistence</span></>
              )}
            </p>
            
            <button
              onClick={signInWithGitHub}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
            
            <div className="mt-6 text-sm text-white/60 text-center">
              <p className="mb-2">✨ Free tier includes:</p>
              <ul className="text-left space-y-1">
                <li>• Up to 3 dashboards</li>
                <li>• All available widgets</li>
                <li>• Basic sharing features</li>
              </ul>
            </div>
          </div>
        </div>
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
      {/* User Profile - Fixed position */}
      {user && (
        <div className="fixed top-4 right-4 z-30">
          <UserProfile />
        </div>
      )}

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
            Create Tab
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
            Rename Current Tab
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setShowSharingDialog(true)}>
            Share Tab
          </ContextMenuItem>
          {user && storageMode === 'cloud' && (
            <ContextMenuItem onClick={async () => {
              try {
                const url = getCurrentDashboardUrl(currentDashboard);
                await navigator.clipboard.writeText(url);
                alert('Tab URL copied to clipboard!');
              } catch (error) {
                console.error('Failed to copy URL:', error);
                alert('Failed to copy URL to clipboard');
              }
            }}>
              Copy Tab URL
            </ContextMenuItem>
          )}
          {dashboards.length > 1 && (
            <ContextMenuItem onClick={() => handleDashboardDelete(currentDashboard)} className="text-red-400 hover:text-red-300">
              Delete Current Tab
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setShowSettings(true)}>
            Settings
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setShowStorageModeSelector(true)}>
            Storage Mode
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

      {/* Dashboard Sharing Dialog */}
      {currentDashboard && (
        <DashboardSharingDialog
          isOpen={showSharingDialog}
          onClose={() => setShowSharingDialog(false)}
          dashboard={currentDashboard}
        />
      )}

      {/* Storage Mode Selector */}
      <StorageModeSelector
        isOpen={showStorageModeSelector}
        onClose={() => setShowStorageModeSelector(false)}
      />
    </div>
  );
}

export default App;