import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Globe } from 'lucide-react';

const timezones = [
  { label: 'New York', value: 'America/New_York' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Paris', value: 'Europe/Paris' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
  { label: 'Sydney', value: 'Australia/Sydney' },
  { label: 'Los Angeles', value: 'America/Los_Angeles' },
  { label: 'Chicago', value: 'America/Chicago' },
  { label: 'Moscow', value: 'Europe/Moscow' },
  { label: 'Dubai', value: 'Asia/Dubai' },
  { label: 'Shanghai', value: 'Asia/Shanghai' },
];

const Clock: React.FC<{ timezone: string, label: string }> = ({ timezone, label }) => {
    const [time, setTime] = useState('');
  
    useEffect(() => {
      const interval = setInterval(() => {
        const date = new Date();
        const timeString = date.toLocaleTimeString('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
        });
        setTime(timeString);
      }, 1000);
  
      return () => clearInterval(interval);
    }, [timezone]);
  
    return (
      <div className="flex items-center justify-between py-2 border-b border-white/10">
        <span className="text-lg text-white">{label}</span>
        <span className="text-2xl font-mono text-accent-400">{time}</span>
      </div>
    );
  };

const WorldTimeWidget: React.FC<WidgetProps> = ({ widget: { config } }) => {
    const selectedTimezones = config.timezones || ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
    
    return (
      <div className="p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-transparent">
        {selectedTimezones.map((tzValue: string) => {
            const tz = timezones.find(t => t.value === tzValue);
            return tz ? <Clock key={tz.value} timezone={tz.value} label={tz.label} /> : null;
        })}
      </div>
    );
  };

  export const worldTimeWidgetConfig: WidgetConfig = {
    type: 'base-world-time',
    name: 'World Time',
    description: 'Displays the current time in different cities.',
    version: '1.0.0',
    defaultSize: { width: 280, height: 220 },
    minSize: { width: 240, height: 160 },
    maxSize: { width: 500, height: 600 },
    component: WorldTimeWidget,
    icon: Globe,
    features: {
      resizable: true,
      fullscreenable: true,
      configurable: true,
    },
    configFields: {
      timezones: {
        type: 'select',
        label: 'Cities',
        description: 'Select cities to display.',
        options: timezones,
        defaultValue: ['America/New_York', 'Europe/London', 'Asia/Tokyo'],
      },
    },
    categories: ['Time & Date'],
    tags: ['time', 'world', 'clock'],
    author: {
      name: 'Your Name',
    },
  }; 