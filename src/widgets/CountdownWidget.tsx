import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../types/widget';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export const CountdownWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(widget.config.timeLeft || 25 * 60); // Default 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(widget.config.initialTime || 25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          onUpdate(widget.id, { config: { ...widget.config, timeLeft: newTime } });
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, widget.id, widget.config, onUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    onUpdate(widget.id, { config: { ...widget.config, timeLeft: initialTime } });
  };

  const setPresetTime = (minutes: number) => {
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsRunning(false);
    onUpdate(widget.id, { 
      config: { 
        ...widget.config, 
        timeLeft: seconds, 
        initialTime: seconds 
      } 
    });
  };

  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

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
            <div className="text-lg font-mono font-bold">{formatTime(timeLeft)}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={toggleTimer}
          className={`p-2 rounded-full transition-colors ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
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