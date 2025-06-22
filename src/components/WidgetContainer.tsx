import React, { useState, useRef, useEffect } from 'react';
import { Widget } from '../types/widget';
import { Move, X } from 'lucide-react';

interface WidgetContainerProps {
  widget: Widget;
  children: React.ReactNode;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onRemove: (id: string) => void;
  gridSize?: number;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widget,
  children,
  onPositionChange,
  onRemove,
  gridSize = 20
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on the drag handle or the widget header area
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const dashboard = containerRef.current.closest('.dashboard');
        if (dashboard) {
          const dashboardRect = dashboard.getBoundingClientRect();
          const newX = Math.max(0, e.clientX - dashboardRect.left - dragOffset.x);
          const newY = Math.max(0, e.clientY - dashboardRect.top - dragOffset.y);
          
          // Snap to grid
          const snappedX = Math.round(newX / gridSize) * gridSize;
          const snappedY = Math.round(newY / gridSize) * gridSize;
          
          // Apply transform immediately for smooth dragging
          containerRef.current.style.transform = `translate(${snappedX}px, ${snappedY}px)`;
          containerRef.current.style.zIndex = '1000';
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const dashboard = containerRef.current.closest('.dashboard');
        if (dashboard) {
          const dashboardRect = dashboard.getBoundingClientRect();
          const newX = Math.max(0, e.clientX - dashboardRect.left - dragOffset.x);
          const newY = Math.max(0, e.clientY - dashboardRect.top - dragOffset.y);
          
          // Snap to grid
          const snappedX = Math.round(newX / gridSize) * gridSize;
          const snappedY = Math.round(newY / gridSize) * gridSize;
          
          // Update the widget position
          onPositionChange(widget.id, { x: snappedX, y: snappedY });
          
          // Reset z-index
          containerRef.current.style.zIndex = '';
        }
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, widget.id, onPositionChange, dragOffset, gridSize]);

  return (
    <div
      ref={containerRef}
      className={`absolute bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
        isDragging ? 'scale-105 shadow-2xl' : ''
      }`}
      style={{
        width: widget.size.width,
        height: widget.size.height,
        transform: `translate(${widget.position.x}px, ${widget.position.y}px)`,
        zIndex: isDragging ? 1000 : 10,
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Widget Header with drag handle */}
      <div 
        className="widget-header absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-3 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs text-white/70 font-medium truncate">{widget.title}</span>
        <div className={`flex items-center gap-1 transition-opacity duration-200 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
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
    </div>
  );
};