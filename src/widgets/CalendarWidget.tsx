import React, { useState } from 'react';
import { WidgetProps } from '../types/widget';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarWidget: React.FC<WidgetProps> = ({ widget }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const isSelected = (day: number) => {
    return selectedDate?.getDate() === day && 
           selectedDate?.getMonth() === month && 
           selectedDate?.getFullYear() === year;
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className={`${widget.isFullscreen ? 'h-24' : 'h-6'}`}
        ></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelectedDay = isSelected(day);
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            ${widget.isFullscreen ? 'h-24 p-1' : 'h-6'} 
            flex flex-col
            ${isSelectedDay
              ? 'bg-purple-500 text-white'
              : isToday(day)
                ? 'bg-purple-500/30 text-white'
                : 'text-white/80 hover:bg-white/10'
            } 
            cursor-pointer transition-colors rounded
          `}
        >
          <div className={`
            ${widget.isFullscreen ? 'text-sm p-1' : 'text-xs'} 
            ${isSelectedDay ? 'font-bold' : ''}
            flex items-center justify-center
          `}>
            {day}
          </div>
          {widget.isFullscreen && (
            <div className="mt-1 text-xs space-y-1">
              {/* Add your event indicators or content here */}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="h-full flex flex-col text-white">
      {/* Calendar Header */}
      <div className={`flex items-center justify-between ${widget.isFullscreen ? 'mb-6' : 'mb-3'}`}>
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <ChevronLeft size={widget.isFullscreen ? 20 : 16} />
        </button>
        <div className="text-center">
          <div className={`font-semibold ${widget.isFullscreen ? 'text-xl' : 'text-sm'}`}>
            {monthNames[month]}
          </div>
          <div className={`text-white/70 ${widget.isFullscreen ? 'text-sm' : 'text-xs'}`}>
            {year}
          </div>
        </div>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <ChevronRight size={widget.isFullscreen ? 20 : 16} />
        </button>
      </div>
      
      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {(widget.isFullscreen ? dayNames : dayNamesShort).map(day => (
          <div 
            key={day} 
            className={`
              ${widget.isFullscreen ? 'text-sm py-2' : 'text-xs'} 
              text-white/60 text-center font-medium
            `}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {renderCalendarDays()}
      </div>

      {/* Selected Date Details (Fullscreen Only) */}
      {widget.isFullscreen && selectedDate && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            {dayNames[selectedDate.getDay()]}, {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}
          </h3>
          <div className="text-sm text-white/70">
            No events scheduled for this day
          </div>
        </div>
      )}
    </div>
  );
};

export const calendarWidgetConfig = {
  type: 'calendar',
  name: 'Calendar',
  description: 'A calendar widget that shows the current month and allows you to track dates',
  defaultSize: { width: 300, height: 280 },
  minSize: { width: 250, height: 250 },
  maxSize: { width: 800, height: 800 },
  component: CalendarWidget,
  icon: CalendarIcon,
  version: '1.0.0',
  features: {
    resizable: true,
    fullscreenable: true,
    hasSettings: false
  }
};