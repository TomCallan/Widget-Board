import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Dashboard, Widget } from '../types/widget';
import { COLOR_SCHEMES } from '../types/widget';
import { WIDGET_REGISTRY } from '../widgets';

const DEFAULT_DASHBOARD: Dashboard = {
  id: '1',
  name: 'Main Dashboard',
  widgets: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  colorScheme: 'purple',
};

export const useDashboards = () => {
  const [dashboards, setDashboards] = useLocalStorage<Dashboard[]>('dashboards', [DEFAULT_DASHBOARD]);
  const [currentDashboardId, setCurrentDashboardId] = useLocalStorage<string>('current-dashboard-id', DEFAULT_DASHBOARD.id);

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
  };

  const handleCloseAllTabs = () => {
    const lockedDashboards = dashboards.filter(d => d.locked);
    if (lockedDashboards.length === 0) {
      // Keep at least one dashboard
      const firstDashboard = { ...DEFAULT_DASHBOARD, id: crypto.randomUUID() };
      setDashboards([firstDashboard]);
      setCurrentDashboardId(firstDashboard.id);
    } else {
      setDashboards(lockedDashboards);
      if (!lockedDashboards.find(d => d.id === currentDashboardId)) {
        setCurrentDashboardId(lockedDashboards[0].id);
      }
    }
  };

  const handleCloseTabsToRight = (dashboard: Dashboard) => {
    const dashboardIndex = dashboards.findIndex(d => d.id === dashboard.id);
    const dashboardsToKeep = dashboards.slice(0, dashboardIndex + 1);
    const lockedDashboardsToRight = dashboards
      .slice(dashboardIndex + 1)
      .filter(d => d.locked);
    
    setDashboards([...dashboardsToKeep, ...lockedDashboardsToRight]);
    
    if (!dashboardsToKeep.find(d => d.id === currentDashboardId) && 
        !lockedDashboardsToRight.find(d => d.id === currentDashboardId)) {
      setCurrentDashboardId(dashboard.id);
    }
  };

  const handleToggleTabLock = (dashboard: Dashboard) => {
    setDashboards(dashboards.map(d =>
      d.id === dashboard.id
        ? { ...d, locked: !d.locked, updatedAt: Date.now() }
        : d
    ));
  };

  return {
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
  };
}; 