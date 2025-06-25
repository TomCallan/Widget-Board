import React, { useState, useEffect } from 'react';
import { WidgetProps, WidgetConfig } from '../../types/widget';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

interface CountdownState {
  timeLeft: number;
  isRunning: boolean;
  duration: number;
}

export const CountdownWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [state, setState] = useState<CountdownState>(() => ({
    timeLeft: widget.config.timeLeft ?? 1500, // 25 minutes in seconds
    isRunning: false,
    duration: widget.config.duration ?? 1500
  }));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prev => {
          const newTime = prev.timeLeft - 1;
          onUpdate(widget.id, { config: { ...widget.config, timeLeft: newTime } });
          return { ...prev, timeLeft: newTime };
        });
      }, 1000);
    } else if (state.timeLeft === 0) {
      setState(prev => ({ ...prev, isRunning: false }));
    }
    
    return () => clearInterval(interval);
  }, [state.isRunning, state.timeLeft, widget.id, widget.config, onUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setState(prev => ({ ...prev, isRunning: false, timeLeft: state.duration }));
    onUpdate(widget.id, { config: { ...widget.config, timeLeft: state.duration } });
  };

  const setPresetTime = (minutes: number) => {
    const seconds = minutes * 60;
    setState(prev => ({ ...prev, timeLeft: seconds, duration: seconds }));
    onUpdate(widget.id, { 
      config: { 
        ...widget.config, 
        timeLeft: seconds, 
        duration: seconds 
      } 
    });
  };

  const progress = state.duration > 0 ? ((state.duration - state.timeLeft) / state.duration) * 100 : 0;

  return (
    <div className="h-full flex flex-col items-center justify-center text-white">
      {/* Timer Display */}
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full border-4 border-white/20 relative">
          <div 
            className="absolute inset-0 rounded-full border-4 border-purple-400 transition-all duration-1000"
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${
                progress <= 50 
                  ? `${50 + progress}% 0%` 
                  : `100% 0%, 100% ${progress - 50}%`
              }${progress > 50 ? `, 100% 100%, 50% 100%, 50% 50%` : ', 50% 50%'})`
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-mono font-bold">{formatTime(state.timeLeft)}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={toggleTimer}
          className={`p-2 rounded-full transition-colors ${
            state.isRunning 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {state.isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-2 bg-gray-500 hover:bg-gray-600 rounded-full transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Preset Times */}
      <div className="flex gap-1">
        {[5, 15, 25, 45].map(minutes => (
          <button
            key={minutes}
            onClick={() => setPresetTime(minutes)}
            className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
          >
            {minutes}m
          </button>
        ))}
      </div>
    </div>
  );
};

export const countdownWidgetConfig: WidgetConfig = {
  type: 'countdown',
  name: 'Timer',
  defaultSize: { width: 240, height: 240 },
  minSize: { width: 200, height: 200 },
  maxSize: { width: 280, height: 280 },
  component: CountdownWidget,
  icon: Timer,
  description: 'Pomodoro and countdown timer',
  features: {
    resizable: false,
    fullscreenable: false,
    hasSettings: true
  },
  version: '1.0.0',
  categories: ['Time & Date', 'Tools']
};