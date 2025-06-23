import React, { useState, useRef, useEffect } from 'react';
import { Dashboard } from '../types/widget';
import { Plus, Edit2, Check, X, Trash2, Settings, Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { COLOR_SCHEMES } from '../types/widget';
import { useIdleTimer } from '../hooks/useIdleTimer';

interface DashboardTabsProps {
  dashboards: Dashboard[];
  currentDashboard: Dashboard;
  onDashboardChange: (dashboard: Dashboard) => void;
  onDashboardAdd: () => void;
  onDashboardRename: (dashboard: Dashboard, newName: string) => void;
  onDashboardDelete: (dashboard: Dashboard) => void;
  onAddWidget: () => void;
  onStyleClick: () => void;
  onSettingsClick: () => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  dashboards,
  currentDashboard,
  onDashboardChange,
  onDashboardAdd,
  onDashboardRename,
  onDashboardDelete,
  onAddWidget,
  onStyleClick,
  onSettingsClick,
}) => {
  const [editingDashboard, setEditingDashboard] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isHoveringTop, setIsHoveringTop] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const { settings, updateAppearanceSettings } = useSettings();
  const isIdle = useIdleTimer(3000); // 3 seconds idle timeout

  // Calculate tab width based on container width
  useEffect(() => {
    const calculateTabWidths = () => {
      if (!tabsContainerRef.current) return;
      
      const container = tabsContainerRef.current;
      const containerWidth = container.offsetWidth;
      const tabCount = dashboards.length;
      const minTabWidth = 120; // Minimum width for a tab
      const maxTabWidth = 200; // Maximum width for a tab
      
      let tabWidth = Math.floor((containerWidth - 16) / tabCount); // 16px for gap
      tabWidth = Math.max(minTabWidth, Math.min(maxTabWidth, tabWidth));
      
      const tabs = container.getElementsByClassName('dashboard-tab');
      Array.from(tabs).forEach((tab) => {
        if (tab instanceof HTMLElement) {
          tab.style.width = `${tabWidth}px`;
        }
      });
    };

    calculateTabWidths();
    window.addEventListener('resize', calculateTabWidths);
    return () => window.removeEventListener('resize', calculateTabWidths);
  }, [dashboards.length]);

  const handleEditStart = (dashboard: Dashboard) => {
    setEditingDashboard(dashboard.id);
    setEditingName(dashboard.name);
  };

  const handleEditSave = (dashboard: Dashboard) => {
    if (editingName.trim()) {
      onDashboardRename(dashboard, editingName.trim());
    }
    setEditingDashboard(null);
  };

  const handleEditCancel = () => {
    setEditingDashboard(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, dashboard: Dashboard) => {
    if (e.key === 'Enter') {
      handleEditSave(dashboard);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const toggleTabBar = () => {
    updateAppearanceSettings({ showTabBar: !settings.appearance.showTabBar });
  };

  // Hide tabs when idle
  useEffect(() => {
    if (isIdle && settings.appearance.showTabBar) {
      updateAppearanceSettings({ showTabBar: false });
    }
  }, [isIdle, settings.appearance.showTabBar, updateAppearanceSettings]);

  // Add hover detection area
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsHoveringTop(e.clientY <= 40);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!settings.appearance.showTabBar) {
    return (
      <div 
        className={`relative transition-opacity duration-300 ${
          isHoveringTop && !isIdle ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={toggleTabBar}
          className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/20 hover:bg-black/30 text-white/70 hover:text-white rounded-b-lg transition-colors z-50 flex items-center gap-2"
        >
          <ChevronDown size={16} />
          <span className="text-sm">Show Dashboard Tabs</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-300 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-black/20">
        <div ref={tabsContainerRef} className="flex-1 flex items-center gap-1 overflow-hidden">
          {dashboards.map(dashboard => {
            const scheme = COLOR_SCHEMES[dashboard.colorScheme] || COLOR_SCHEMES['purple'];
            const isActive = currentDashboard.id === dashboard.id;
            
            return (
              <div
                key={dashboard.id}
                className={`dashboard-tab group flex items-center gap-1 px-4 py-2 rounded-t-lg transition-colors cursor-pointer relative shrink-0 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => onDashboardChange(dashboard)}
              >
                {isActive && (
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${scheme.from} ${scheme.via} ${scheme.to}`}
                  />
                )}
                {editingDashboard === dashboard.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, dashboard)}
                      className="bg-transparent border-b border-white/30 focus:border-white/60 outline-none px-1 py-0.5 text-sm w-32"
                      autoFocus
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSave(dashboard);
                      }}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCancel();
                      }}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${scheme.from} ${scheme.via} ${scheme.to} mr-2`} />
                    <span className="text-sm truncate">{dashboard.name}</span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStart(dashboard);
                        }}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <Edit2 size={12} />
                      </button>
                      {dashboards.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDashboardDelete(dashboard);
                          }}
                          className="p-1 hover:bg-white/10 rounded text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDashboardAdd}
            className="flex items-center gap-1 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Plus size={16} />
            New Dashboard
          </button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <button
            onClick={onAddWidget}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
          >
            <Plus size={18} />
            Add Widget
          </button>
          <button 
            onClick={onStyleClick}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Palette size={20} />
          </button>
          <button 
            onClick={onSettingsClick}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings size={20} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <button
            onClick={toggleTabBar}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Hide Dashboard Tabs"
          >
            <ChevronUp size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}; 