import React, { useState } from 'react';
import { WidgetProps } from '../types/widget';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarWidget: React.FC<WidgetProps> = ({ widget }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
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
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
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
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-6"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`h-6 flex items-center justify-center text-xs rounded ${
            isToday(day)
              ? 'bg-purple-500 text-white font-bold'
              : 'text-white/80 hover:bg-white/10'
          } cursor-pointer transition-colors`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="h-full flex flex-col text-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <div className="font-semibold text-sm">{monthNames[month]}</div>
          <div className="text-xs text-white/70">{year}</div>
        </div>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-xs text-white/60 text-center font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};