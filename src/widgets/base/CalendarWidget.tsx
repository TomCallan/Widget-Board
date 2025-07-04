import React, { useState } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Calendar as CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

type CalendarDay = {
    date: number;
    isCurrentMonth: boolean;
    isToday: boolean;
};

const CalendarWidget: React.FC<WidgetProps> = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const generateCalendarDays = (date: Date): CalendarDay[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = new Date();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days: CalendarDay[] = [];

        // Previous month's days
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            days.push({
                date: daysInPrevMonth - i,
                isCurrentMonth: false,
                isToday: false,
            });
        }

        // Current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            days.push({
                date: i,
                isCurrentMonth: true,
                isToday: d.toDateString() === today.toDateString(),
            });
        }
        
        // Next month's days
        const remainingCells = 42 - days.length; // 6 rows * 7 days
        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                date: i,
                isCurrentMonth: false,
                isToday: false,
            });
        }

        return days;
    };

    const [days, setDays] = useState(generateCalendarDays(currentDate));

    const prevMonth = () => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        setCurrentDate(newDate);
        setDays(generateCalendarDays(newDate));
    };

    const nextMonth = () => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        setCurrentDate(newDate);
        setDays(generateCalendarDays(newDate));
    };
    
    return (
    <div className="p-4 h-full flex flex-col text-white">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft />
        </button>
        <h3 className="text-lg font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-white/50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2 flex-grow">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              flex items-center justify-center p-1 rounded-full text-center text-sm
              ${day.isCurrentMonth ? 'text-white' : 'text-white/30'}
              ${day.isToday ? 'bg-accent-500 font-bold' : ''}
              ${!day.isCurrentMonth ? 'pointer-events-none' : ''}
            `}
          >
            {day.date}
          </div>
        ))}
      </div>
    </div>
  );
};

export const calendarWidgetConfig: WidgetConfig = {
  type: 'base-calendar',
  name: 'Calendar',
  description: 'A simple calendar widget.',
  version: '1.0.0',
  defaultSize: { width: 320, height: 300 },
  minSize: { width: 280, height: 280 },
  maxSize: { width: 500, height: 400 },
  component: CalendarWidget,
  icon: CalendarDays,
  features: {
    resizable: true,
    fullscreenable: false,
    configurable: false,
  },
  categories: ['Time & Date'],
  tags: ['calendar', 'date', 'month'],
  author: {
    name: 'Your Name',
  },
}; 