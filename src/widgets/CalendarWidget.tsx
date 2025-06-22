import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../types/widget';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Plus, Bell, Share2, RefreshCw, X, Settings, Check,
  ExternalLink, Clock, RepeatIcon
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendarId: string;
  description?: string;
  location?: string;
  reminder?: {
    type: 'minutes' | 'hours' | 'days';
    amount: number;
    notified?: boolean;
  };
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    until?: Date;
  };
  color?: string;
  isExternal?: boolean;
  externalSource?: string;
}

interface Calendar {
  id: string;
  name: string;
  color: string;
  isEnabled: boolean;
  isExternal?: boolean;
  externalSource?: string;
  sharingUrl?: string;
}

export const CalendarWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({});
  
  const [calendars, setCalendars] = useState<Calendar[]>(widget.config.calendars || [
    { id: '1', name: 'Personal', color: 'purple', isEnabled: true },
    { id: '2', name: 'Work', color: 'blue', isEnabled: true },
    { id: '3', name: 'External', color: 'green', isEnabled: true, isExternal: true, externalSource: 'Google Calendar' }
  ]);

  const [events, setEvents] = useState<CalendarEvent[]>(widget.config.events || [
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(new Date().setHours(10, 0, 0, 0)),
      end: new Date(new Date().setHours(11, 0, 0, 0)),
      calendarId: '2',
      description: 'Weekly team sync',
      reminder: { type: 'minutes', amount: 15 },
      recurring: { frequency: 'weekly', interval: 1 }
    }
  ]);
  
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

  useEffect(() => {
    // Check for event reminders
    const checkReminders = () => {
      const now = new Date();
      events.forEach(event => {
        if (event.reminder && !event.reminder.notified) {
          const reminderTime = new Date(event.start);
          switch (event.reminder.type) {
            case 'minutes':
              reminderTime.setMinutes(reminderTime.getMinutes() - event.reminder.amount);
              break;
            case 'hours':
              reminderTime.setHours(reminderTime.getHours() - event.reminder.amount);
              break;
            case 'days':
              reminderTime.setDate(reminderTime.getDate() - event.reminder.amount);
              break;
          }

          if (now >= reminderTime) {
            // Show notification
            if (Notification.permission === 'granted') {
              new Notification(`Event Reminder: ${event.title}`, {
                body: `Starting in ${event.reminder.amount} ${event.reminder.type}`,
                icon: '/path/to/calendar-icon.png'
              });
            }

            // Mark reminder as notified
            const updatedEvents = events.map(e =>
              e.id === event.id
                ? {
                    ...e,
                    reminder: e.reminder ? {
                      ...e.reminder,
                      notified: true,
                      type: e.reminder.type as 'minutes' | 'hours' | 'days'
                    } : undefined
                  }
                : e
            ) as CalendarEvent[];
            setEvents(updatedEvents);
            onUpdate(widget.id, { config: { ...widget.config, events: updatedEvents } });
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events, widget.id, widget.config, onUpdate]);

  useEffect(() => {
    // Handle recurring events
    const expandRecurringEvents = () => {
      const expandedEvents = [...events];
      const now = new Date();
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 3); // Look ahead 3 months

      events.forEach(event => {
        if (event.recurring) {
          let currentDate = new Date(event.start);
          while (currentDate <= futureDate) {
            switch (event.recurring.frequency) {
              case 'daily':
                currentDate.setDate(currentDate.getDate() + event.recurring.interval);
                break;
              case 'weekly':
                currentDate.setDate(currentDate.getDate() + (7 * event.recurring.interval));
                break;
              case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + event.recurring.interval);
                break;
              case 'yearly':
                currentDate.setFullYear(currentDate.getFullYear() + event.recurring.interval);
                break;
            }

            if (currentDate > futureDate || (event.recurring.until && currentDate > event.recurring.until)) {
              break;
            }

            if (currentDate > now) {
              const duration = event.end.getTime() - event.start.getTime();
              const newEnd = new Date(currentDate.getTime() + duration);
              
              const recurringEvent: CalendarEvent = {
                ...event,
                id: `${event.id}-${currentDate.getTime()}`,
                start: new Date(currentDate),
                end: newEnd
              };
              expandedEvents.push(recurringEvent);
            }
          }
        }
      });

      return expandedEvents;
    };

    const expanded = expandRecurringEvents();
    if (expanded.length !== events.length) {
      setEvents(expanded);
      onUpdate(widget.id, { config: { ...widget.config, events: expanded } });
    }
  }, [events, widget.id, widget.config, onUpdate]);

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

  const addEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end && newEvent.calendarId) {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        calendarId: newEvent.calendarId,
        description: newEvent.description,
        location: newEvent.location,
        reminder: newEvent.reminder,
        recurring: newEvent.recurring
      };

      const updatedEvents = [...events, event];
      setEvents(updatedEvents);
      onUpdate(widget.id, { config: { ...widget.config, events: updatedEvents } });
      setNewEvent({});
      setShowEventForm(false);
    }
  };

  const toggleCalendar = (calendarId: string) => {
    const updatedCalendars = calendars.map(cal =>
      cal.id === calendarId ? { ...cal, isEnabled: !cal.isEnabled } : cal
    );
    setCalendars(updatedCalendars);
    onUpdate(widget.id, { config: { ...widget.config, calendars: updatedCalendars } });
  };

  const shareCalendar = (calendar: Calendar) => {
    // Generate sharing URL (in a real app, this would be a backend call)
    const sharingUrl = `https://app.example.com/calendar/share/${calendar.id}`;
    const updatedCalendars = calendars.map(cal =>
      cal.id === calendar.id ? { ...cal, sharingUrl } : cal
    );
    setCalendars(updatedCalendars);
    onUpdate(widget.id, { config: { ...widget.config, calendars: updatedCalendars } });

    // Copy to clipboard
    navigator.clipboard.writeText(sharingUrl);
  };

  const getEventsForDay = (day: number) => {
    const date = new Date(year, month, day);
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === month &&
             eventDate.getFullYear() === year &&
             calendars.find(cal => cal.id === event.calendarId)?.isEnabled;
    });
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
      const dayEvents = getEventsForDay(day);
      
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
          {widget.isFullscreen && dayEvents.length > 0 && (
            <div className="mt-1 text-xs space-y-1 overflow-y-auto">
              {dayEvents.map(event => {
                const calendar = calendars.find(cal => cal.id === event.calendarId);
                return (
                  <div
                    key={event.id}
                    className={`px-1 py-0.5 rounded truncate flex items-center gap-1`}
                    style={{ backgroundColor: `${calendar?.color}40` }}
                  >
                    <div className={`w-1 h-1 rounded-full`} style={{ backgroundColor: calendar?.color }} />
                    <span className="truncate">{event.title}</span>
                    {event.recurring && <RepeatIcon size={8} />}
                    {event.reminder && <Bell size={8} />}
                  </div>
                );
              })}
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
        <div className="text-center flex-1">
          <div className={`font-semibold ${widget.isFullscreen ? 'text-xl' : 'text-sm'}`}>
            {monthNames[month]}
          </div>
          <div className={`text-white/70 ${widget.isFullscreen ? 'text-sm' : 'text-xs'}`}>
            {year}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Settings size={widget.isFullscreen ? 20 : 16} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <ChevronRight size={widget.isFullscreen ? 20 : 16} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-2 bg-white/5 rounded">
          <h4 className="text-sm font-medium mb-2">Calendars</h4>
          <div className="space-y-2">
            {calendars.map(calendar => (
              <div key={calendar.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCalendar(calendar.id)}
                    className={`p-1 rounded ${
                      calendar.isEnabled ? 'bg-purple-500' : 'bg-white/10'
                    }`}
                  >
                    {calendar.isEnabled && <Check size={12} />}
                  </button>
                  <span className="text-sm">{calendar.name}</span>
                  {calendar.isExternal && (
                    <ExternalLink size={12} className="text-white/50" />
                  )}
                </div>
                {!calendar.isExternal && (
                  <button
                    onClick={() => shareCalendar(calendar)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Share Calendar"
                  >
                    <Share2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {dayNames[selectedDate.getDay()]}, {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}
            </h3>
            <button
              onClick={() => setShowEventForm(true)}
              className="p-1 bg-purple-500 hover:bg-purple-600 rounded transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Event Form */}
          {showEventForm && (
            <div className="space-y-2 mb-4 p-2 bg-white/10 rounded">
              <input
                type="text"
                value={newEvent.title || ''}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title"
                className="w-full px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <div className="flex gap-2">
                <select
                  value={newEvent.calendarId || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, calendarId: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">Select Calendar</option>
                  {calendars.filter(cal => !cal.isExternal).map(calendar => (
                    <option key={calendar.id} value={calendar.id}>
                      {calendar.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={newEvent.start ? new Date(newEvent.start).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                  className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="datetime-local"
                  value={newEvent.end ? new Date(newEvent.end).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                  className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <input
                type="text"
                value={newEvent.location || ''}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Location"
                className="w-full px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <textarea
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Description"
                className="w-full px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 h-20"
              />

              <div className="flex gap-2">
                <select
                  value={newEvent.reminder ? `${newEvent.reminder.amount}-${newEvent.reminder.type}` : ''}
                  onChange={(e) => {
                    const [amount, type] = e.target.value.split('-');
                    setNewEvent({
                      ...newEvent,
                      reminder: e.target.value ? {
                        amount: parseInt(amount),
                        type: type as 'minutes' | 'hours' | 'days'
                      } : undefined
                    });
                  }}
                  className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">No Reminder</option>
                  <option value="15-minutes">15 minutes before</option>
                  <option value="30-minutes">30 minutes before</option>
                  <option value="1-hours">1 hour before</option>
                  <option value="1-days">1 day before</option>
                </select>

                <select
                  value={newEvent.recurring ? `${newEvent.recurring.frequency}-${newEvent.recurring.interval}` : ''}
                  onChange={(e) => {
                    const [frequency, interval] = e.target.value.split('-');
                    setNewEvent({
                      ...newEvent,
                      recurring: e.target.value ? {
                        frequency: frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
                        interval: parseInt(interval)
                      } : undefined
                    });
                  }}
                  className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">Not Recurring</option>
                  <option value="daily-1">Daily</option>
                  <option value="weekly-1">Weekly</option>
                  <option value="monthly-1">Monthly</option>
                  <option value="yearly-1">Yearly</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addEvent}
                  className="flex-1 py-1 bg-purple-500 hover:bg-purple-600 rounded text-sm transition-colors"
                >
                  Add Event
                </button>
                <button
                  onClick={() => {
                    setShowEventForm(false);
                    setNewEvent({});
                  }}
                  className="flex-1 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-2">
            {getEventsForDay(selectedDate.getDate()).map(event => {
              const calendar = calendars.find(cal => cal.id === event.calendarId);
              return (
                <div
                  key={event.id}
                  className="p-2 rounded"
                  style={{ backgroundColor: `${calendar?.color}20` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: calendar?.color }}
                      />
                      <h4 className="text-sm font-medium">{event.title}</h4>
                    </div>
                    <div className="flex items-center gap-1 text-white/50">
                      {event.recurring && (
                        <RepeatIcon size={14} className="text-white/50" />
                      )}
                      {event.reminder && (
                        <Bell size={14} className="text-white/50" />
                      )}
                      {calendar?.isExternal && (
                        <ExternalLink size={14} className="text-white/50" />
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-white/70 flex items-center gap-2">
                    <Clock size={10} />
                    {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {event.location && (
                    <div className="text-xs text-white/70 mt-1">
                      📍 {event.location}
                    </div>
                  )}
                  {event.description && (
                    <div className="text-xs text-white/70 mt-1">
                      {event.description}
                    </div>
                  )}
                </div>
              );
            })}
            {getEventsForDay(selectedDate.getDate()).length === 0 && (
              <div className="text-sm text-white/50">
                No events scheduled for this day
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const calendarWidgetConfig = {
  type: 'calendar',
  name: 'Calendar',
  description: 'A calendar widget that shows the current month and allows you to track dates and events',
  defaultSize: { width: 300, height: 280 },
  minSize: { width: 250, height: 250 },
  maxSize: { width: 800, height: 800 },
  component: CalendarWidget,
  icon: CalendarIcon,
  version: '1.0.0',
  features: {
    resizable: true,
    fullscreenable: true,
    hasSettings: true
  }
};