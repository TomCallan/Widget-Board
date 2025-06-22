import React, { useState } from 'react';
import { Widget, DashboardPage } from './types/widget';
import { WidgetContainer } from './components/WidgetContainer';
import { WidgetSelector } from './components/WidgetSelector';
import { PageManager } from './components/PageManager';
import { WIDGET_REGISTRY } from './widgets';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Plus, Settings, Home } from 'lucide-react';

const DEFAULT_WIDGETS: Widget[] = [
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
];

const DEFAULT_PAGES: DashboardPage[] = [
  {
    id: 'default',
    name: 'Home',
    widgets: DEFAULT_WIDGETS,
    icon: Home,
    color: 'purple'
  }
];

function App() {
  const [pages, setPages] = useLocalStorage<DashboardPage[]>('dashboard-pages', DEFAULT_PAGES);
  const [currentPageId, setCurrentPageId] = useLocalStorage<string>('current-page-id', 'default');
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);

  const currentPage = pages.find(p => p.id === currentPageId) || pages[0];
  const widgets = currentPage.widgets;

  const updateCurrentPage = (updatedWidgets: Widget[]) => {
    setPages(pages.map(page =>
      page.id === currentPageId
        ? { ...page, widgets: updatedWidgets }
        : page
    ));
  };

  const handlePositionChange = (id: string, position: { x: number; y: number }) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === id ? { ...widget, position } : widget
    );
    updateCurrentPage(updatedWidgets);
  };

  const handleSizeChange = (id: string, size: { width: number; height: number }) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === id ? { ...widget, size } : widget
    );
    updateCurrentPage(updatedWidgets);
  };

  const handleToggleFullscreen = (id: string) => {
    const updatedWidgets = widgets.map(widget => {
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
    });
    updateCurrentPage(updatedWidgets);
  };

  const handleRemoveWidget = (id: string) => {
    const updatedWidgets = widgets.filter(widget => widget.id !== id);
    updateCurrentPage(updatedWidgets);
  };

  const handleAddWidget = (type: string) => {
    const config = WIDGET_REGISTRY[type];
    if (!config) return;

    const findAvailablePosition = () => {
      const gridSize = 20;
      const maxAttempts = 100;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = Math.floor(Math.random() * 10) * gridSize + 40;
        const y = Math.floor(Math.random() * 10) * gridSize + 40;
        
        const overlaps = widgets.some(widget => {
          const widgetRight = widget.position.x + widget.size.width;
          const widgetBottom = widget.position.y + widget.size.height;
          const newRight = x + config.defaultSize.width;
          const newBottom = y + config.defaultSize.height;
          
          return !(x >= widgetRight || newRight <= widget.position.x || 
                   y >= widgetBottom || newBottom <= widget.position.y);
        });
        
        if (!overlaps) {
          return { x, y };
        }
      }
      
      return { x: 100 + (widgets.length * 20), y: 100 + (widgets.length * 20) };
    };

    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: config.name,
      position: findAvailablePosition(),
      size: { ...config.defaultSize },
      config: {},
      enabled: true
    };

    updateCurrentPage([...widgets, newWidget]);
  };

  const handleUpdateWidget = (id: string, updates: Partial<Widget>) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === id ? { ...widget, ...updates } : widget
    );
    updateCurrentPage(updatedWidgets);
  };

  const handleAddPage = (page: DashboardPage) => {
    setPages([...pages, page]);
    setCurrentPageId(page.id);
  };

  const handleUpdatePage = (pageId: string, updates: Partial<DashboardPage>) => {
    setPages(pages.map(page =>
      page.id === pageId ? { ...page, ...updates } : page
    ));
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length <= 1) return; // Don't delete the last page
    
    const newPages = pages.filter(page => page.id !== pageId);
    setPages(newPages);
    
    if (currentPageId === pageId) {
      setCurrentPageId(newPages[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
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
      <header className="relative z-20 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Daily Dashboard</h1>
          <p className="text-white/70 text-sm">Your command center for productivity</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWidgetSelector(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus size={18} />
            Add Widget
          </button>
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Page Manager */}
      <PageManager
        pages={pages}
        currentPageId={currentPageId}
        onPageChange={setCurrentPageId}
        onPageAdd={handleAddPage}
        onPageUpdate={handleUpdatePage}
        onPageDelete={handleDeletePage}
      />

      {/* Dashboard */}
      <main className="dashboard relative z-10 px-6 pb-6" style={{ minHeight: 'calc(100vh - 180px)' }}>
        {widgets.map(widget => {
          const config = WIDGET_REGISTRY[widget.type];
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

        {widgets.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Plus className="mx-auto mb-4 text-white/30" size={48} />
              <p className="text-white/50 mb-4">No widgets added yet</p>
              <button
                onClick={() => setShowWidgetSelector(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Add Your First Widget
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Widget Selector Modal */}
      <WidgetSelector
        isOpen={showWidgetSelector}
        onClose={() => setShowWidgetSelector(false)}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
}

export default App;