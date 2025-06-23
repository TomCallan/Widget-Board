import React, { useState, useRef, useEffect } from 'react';
import { Widget, WidgetConfig } from '../types/widget';
import { Move, X, Maximize2, Minimize2, ArrowUpDown, Settings } from 'lucide-react';

interface WidgetContainerProps {
  widget: Widget;
  widgetConfig: WidgetConfig;
  children: React.ReactNode;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onRemove: (id: string) => void;
  onToggleFullscreen: (id: string) => void;
  onConfigureWidget?: (id: string) => void;
  gridSize?: number;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widget,
  widgetConfig,
  children,
  onPositionChange,
  onSizeChange,
  onRemove,
  onToggleFullscreen,
  onConfigureWidget,
  gridSize = 20
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isDragHandle = target.closest('.drag-handle') || target.closest('.widget-header');
    
    if (isDragHandle) {
      e.preventDefault();
      e.stopPropagation();
      
      setIsDragging(true);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setResizeStartSize({ width: widget.size.width, height: widget.size.height });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current && !widget.isFullscreen) {
        const dashboard = containerRef.current.closest('.dashboard');
        if (dashboard) {
          const dashboardRect = dashboard.getBoundingClientRect();
          const newX = Math.max(0, e.clientX - dashboardRect.left - dragOffset.x);
          const newY = Math.max(0, e.clientY - dashboardRect.top - dragOffset.y);
          
          const snappedX = Math.round(newX / gridSize) * gridSize;
          const snappedY = Math.round(newY / gridSize) * gridSize;
          
          containerRef.current.style.transform = `translate(${snappedX}px, ${snappedY}px)`;
          containerRef.current.style.zIndex = '1000';
        }
      } else if (isResizing && containerRef.current && !widget.isFullscreen) {
        const deltaX = e.clientX - resizeStartPos.x;
        const deltaY = e.clientY - resizeStartPos.y;
        
        const newWidth = Math.max(
          widgetConfig.minSize.width,
          Math.min(widgetConfig.maxSize.width, resizeStartSize.width + deltaX)
        );
        const newHeight = Math.max(
          widgetConfig.minSize.height,
          Math.min(widgetConfig.maxSize.height, resizeStartSize.height + deltaY)
        );

        const snappedWidth = Math.round(newWidth / gridSize) * gridSize;
        const snappedHeight = Math.round(newHeight / gridSize) * gridSize;
        
        containerRef.current.style.width = `${snappedWidth}px`;
        containerRef.current.style.height = `${snappedHeight}px`;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const dashboard = containerRef.current.closest('.dashboard');
        if (dashboard) {
          const dashboardRect = dashboard.getBoundingClientRect();
          const newX = Math.max(0, e.clientX - dashboardRect.left - dragOffset.x);
          const newY = Math.max(0, e.clientY - dashboardRect.top - dragOffset.y);
          
          const snappedX = Math.round(newX / gridSize) * gridSize;
          const snappedY = Math.round(newY / gridSize) * gridSize;
          
          onPositionChange(widget.id, { x: snappedX, y: snappedY });
          containerRef.current.style.zIndex = '';
        }
        setIsDragging(false);
      }
      
      if (isResizing && containerRef.current) {
        const width = parseInt(containerRef.current.style.width);
        const height = parseInt(containerRef.current.style.height);
        onSizeChange(widget.id, { width, height });
        setIsResizing(false);
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing, widget.id, onPositionChange, onSizeChange, dragOffset, resizeStartPos, resizeStartSize, gridSize, widget.isFullscreen, widgetConfig.minSize, widgetConfig.maxSize]);

  return (
    <div
      ref={containerRef}
      className={`absolute bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
        isDragging ? 'scale-105 shadow-2xl' : ''
      } ${widget.isFullscreen ? 'fixed inset-0 w-full h-full z-50 rounded-none' : ''}`}
      style={
        widget.isFullscreen
          ? { transform: 'none' }
          : {
              width: widget.size.width,
              height: widget.size.height,
              transform: `translate(${widget.position.x}px, ${widget.position.y}px)`,
              zIndex: isDragging || isResizing ? 1000 : 10,
            }
      }
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Widget Header with controls */}
      <div 
        className="widget-header absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-3 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs text-white/70 font-medium truncate">{widget.title}</span>
        <div className={`flex items-center gap-1 transition-opacity duration-200 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          {widgetConfig.features?.configurable && widgetConfig.configFields && (
            <button
              onClick={() => onConfigureWidget?.(widget.id)}
              className="p-1 text-white/70 hover:text-purple-400 hover:bg-white/10 rounded transition-colors"
            >
              <Settings size={12} />
            </button>
          )}
          {widgetConfig.features?.resizable && !widget.isFullscreen && (
            <div
              className="p-1 rounded hover:bg-white/10 transition-colors cursor-se-resize"
              onMouseDown={handleResizeStart}
            >
              <ArrowUpDown size={12} className="text-white/70" />
            </div>
          )}
          {widgetConfig.features?.fullscreenable && (
            <button
              onClick={() => onToggleFullscreen(widget.id)}
              className="p-1 text-white/70 hover:text-blue-400 hover:bg-white/10 rounded transition-colors"
            >
              {widget.isFullscreen ? (
                <Minimize2 size={12} />
              ) : (
                <Maximize2 size={12} />
              )}
            </button>
          )}
          <div className="drag-handle p-1 rounded hover:bg-white/10 transition-colors">
            <Move size={12} className="text-white/70" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(widget.id);
            }}
            className="p-1 text-white/70 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="h-full pt-8 p-4">
        {children}
      </div>

      {/* Resize handle */}
      {widgetConfig.features?.resizable && !widget.isFullscreen && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};