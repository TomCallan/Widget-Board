import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../types/widget';
import { Clock } from 'lucide-react';

export const ClockWidget: React.FC<WidgetProps> = ({ widget }) => {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

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
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-white">
      <div className="text-3xl font-bold mb-2 font-mono tracking-tight">
        {formatTime(time)}
      </div>
      <div className="text-sm text-white/70 text-center">
        {formatDate(time)}
      </div>
    </div>
  );
};