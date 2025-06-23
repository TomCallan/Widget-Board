import React, { useState, useEffect } from 'react';
import { WidgetProps, WidgetConfig } from '../../types/widget';
import { Clock } from 'lucide-react';

interface ClockConfig {
  showSeconds: boolean;
  use24Hour: boolean;
  showDate: boolean;
  dateFormat: 'short' | 'medium' | 'long';
}

const defaultConfig: ClockConfig = {
  showSeconds: true,
  use24Hour: false,
  showDate: true,
  dateFormat: 'long'
};

export const ClockWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const config: ClockConfig = { ...defaultConfig, ...widget.config };

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <Clock className="text-white/50" size={24} />
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: config.showSeconds ? '2-digit' : undefined,
      hour12: !config.use24Hour
    });
  };

  const formatDate = (date: Date) => {
    if (!config.showDate) return null;
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: config.dateFormat === 'short' ? 'short' : 'long',
      year: config.dateFormat === 'short' ? '2-digit' : 'numeric',
      month: config.dateFormat === 'short' ? 'short' : 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-white">
      <div className="text-3xl font-bold mb-2 font-mono tracking-tight">
        {formatTime(time)}
      </div>
      {config.showDate && (
        <div className="text-sm text-white/70 text-center">
          {formatDate(time)}
        </div>
      )}
    </div>
  );
};

export const clockWidgetConfig: WidgetConfig = {
  type: 'clock',
  name: 'Clock',
  defaultSize: { width: 280, height: 160 },
  minSize: { width: 200, height: 120 },
  maxSize: { width: 400, height: 200 },
  component: ClockWidget,
  icon: Clock,
  description: 'Real-time clock with date display',
  features: {
    resizable: true,
    fullscreenable: false,
    hasSettings: false,
    configurable: true
  },
  configFields: {
    showSeconds: {
      type: 'boolean',
      label: 'Show Seconds',
      description: 'Display seconds in the time',
      default: true
    },
    use24Hour: {
      type: 'boolean',
      label: '24-Hour Format',
      description: 'Use 24-hour time format instead of AM/PM',
      default: false
    },
    showDate: {
      type: 'boolean',
      label: 'Show Date',
      description: 'Display the current date below the time',
      default: true
    },
    dateFormat: {
      type: 'select',
      label: 'Date Format',
      description: 'Choose how the date should be displayed',
      default: 'long',
      options: [
        { label: 'Short (Wed, Jan 1, \'24)', value: 'short' },
        { label: 'Medium (Wednesday, January 1)', value: 'medium' },
        { label: 'Long (Wednesday, January 1, 2024)', value: 'long' }
      ]
    }
  },
  version: '1.0.0',
  categories: ['Time & Date']
};