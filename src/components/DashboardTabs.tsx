import React, { useState } from 'react';
import { Dashboard } from '../types/widget';
import { Plus, Edit2, Check, X, Trash2 } from 'lucide-react';
import { COLOR_SCHEMES } from '../types/widget';

interface DashboardTabsProps {
  dashboards: Dashboard[];
  currentDashboard: Dashboard;
  onDashboardChange: (dashboard: Dashboard) => void;
  onDashboardAdd: () => void;
  onDashboardRename: (dashboard: Dashboard, newName: string) => void;
  onDashboardDelete: (dashboard: Dashboard) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  dashboards,
  currentDashboard,
  onDashboardChange,
  onDashboardAdd,
  onDashboardRename,
  onDashboardDelete,
}) => {
  const [editingDashboard, setEditingDashboard] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-black/20">
      <div className="flex-1 flex items-center gap-1 overflow-x-auto">
        {dashboards.map(dashboard => {
          const scheme = COLOR_SCHEMES[dashboard.colorScheme] || COLOR_SCHEMES['purple'];
          const isActive = currentDashboard.id === dashboard.id;
          
          return (
            <div
              key={dashboard.id}
              className={`group flex items-center gap-1 px-4 py-2 rounded-t-lg transition-colors cursor-pointer relative ${
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
                  <span className="text-sm">{dashboard.name}</span>
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
      <button
        onClick={onDashboardAdd}
        className="flex items-center gap-1 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
      >
        <Plus size={16} />
        New Dashboard
      </button>
    </div>
  );
}; 