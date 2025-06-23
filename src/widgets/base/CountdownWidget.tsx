import React, { useState, useEffect, useCallback } from 'react';
import { WidgetProps, WidgetConfig } from '../../types/widget';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { useWidgetNotifications } from '../../hooks/useWidgetNotifications';

interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  endTime?: number;
}

export const CountdownWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [state, setState] = useState<CountdownState>(() => {
    return widget.config.state || {
      hours: 0,
      minutes: 25,
      seconds: 0,
      isRunning: false
    };
  });

  const { sendNotification } = useWidgetNotifications(countdownWidgetConfig);

  const saveState = useCallback((newState: CountdownState) => {
    setState(newState);
    onUpdate(widget.id, { config: { ...widget.config, state: newState } });
  }, [widget.id, onUpdate]);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const totalSeconds = state.hours * 3600 + state.minutes * 60 + state.seconds;
  const isZero = totalSeconds === 0;

  useEffect(() => {
    let interval: number | undefined;

    if (state.isRunning && !isZero) {
      interval = window.setInterval(() => {
        const now = Date.now();
        const endTime = state.endTime as number;
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

        if (remaining === 0) {
          saveState({
            hours: 0,
            minutes: 0,
            seconds: 0,
            isRunning: false
          });
          sendNotification('Countdown timer finished!', {
            type: 'success',
            duration: 10000
          });
        } else {
          const hours = Math.floor(remaining / 3600);
          const minutes = Math.floor((remaining % 3600) / 60);
          const seconds = remaining % 60;
          setState(prev => ({
            ...prev,
            hours,
            minutes,
            seconds
          }));
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [state.isRunning, state.endTime, isZero, saveState, sendNotification]);

  const handleStart = () => {
    if (!isZero) {
      const endTime = Date.now() + totalSeconds * 1000;
      saveState({ ...state, isRunning: true, endTime });
    }
  };

  const handlePause = () => {
    saveState({ ...state, isRunning: false });
  };

  const handleReset = () => {
    saveState({
      hours: 0,
      minutes: 25,
      seconds: 0,
      isRunning: false
    });
  };

  const handleTimeChange = (field: keyof Pick<CountdownState, 'hours' | 'minutes' | 'seconds'>, value: string) => {
    const numValue = Math.min(field === 'hours' ? 99 : 59, Math.max(0, parseInt(value) || 0));
    saveState({ ...state, [field]: numValue });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-white">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          min="0"
          max="99"
          value={state.hours}
          onChange={(e) => handleTimeChange('hours', e.target.value)}
          className="w-16 bg-white/5 border border-white/20 rounded px-2 py-1 text-center"
          disabled={state.isRunning}
        />
        <span>:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={state.minutes}
          onChange={(e) => handleTimeChange('minutes', e.target.value)}
          className="w-16 bg-white/5 border border-white/20 rounded px-2 py-1 text-center"
          disabled={state.isRunning}
        />
        <span>:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={state.seconds}
          onChange={(e) => handleTimeChange('seconds', e.target.value)}
          className="w-16 bg-white/5 border border-white/20 rounded px-2 py-1 text-center"
          disabled={state.isRunning}
        />
      </div>

      <div className="flex items-center gap-2">
        {!state.isRunning ? (
          <button
            onClick={handleStart}
            disabled={isZero}
            className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={20} />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
          >
            <Pause size={20} />
          </button>
        )}
        <button
          onClick={handleReset}
          className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

export const countdownWidgetConfig: WidgetConfig = {
  type: 'countdown',
  name: 'Countdown Timer',
  defaultSize: { width: 300, height: 200 },
  minSize: { width: 250, height: 150 },
  maxSize: { width: 400, height: 300 },
  component: CountdownWidget,
  icon: Timer,
  description: 'Countdown timer with notifications',
  features: {
    resizable: true,
    fullscreenable: false,
    hasSettings: false,
    notifications: {
      sound: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
      desktop: true,
      toast: true
    }
  },
  version: '1.0.0',
  categories: ['Productivity', 'Time Management']
};