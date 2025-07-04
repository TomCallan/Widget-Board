import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Timer } from 'lucide-react';

const PomodoroTimerWidget: React.FC<WidgetProps> = ({ widget: { config } }) => {
  const workDuration = (config.workDuration || 25) * 60;
  const breakDuration = (config.breakDuration || 5) * 60;

  const [time, setTime] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time]);

  useEffect(() => {
    if (isActive && time === 0) {
      // Switch between work and break when timer reaches 0
      setIsBreak((prevIsBreak) => {
        const newIsBreak = !prevIsBreak;
        setTime(newIsBreak ? breakDuration : workDuration);
        return newIsBreak;
      });
    }
  }, [isActive, time, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTime(workDuration);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="p-4 h-full flex flex-col items-center justify-center text-white">
      <div
        className={`w-48 h-48 rounded-full flex items-center justify-center text-5xl font-bold font-mono
          border-8 transition-colors
          ${isBreak ? 'border-blue-500/50 text-blue-400' : 'border-accent-500/50 text-accent-400'}`}
      >
        {formatTime(time)}
      </div>
      <div className="mt-6 text-lg tracking-wider">
        {isBreak ? 'BREAK' : 'FOCUS'}
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={toggleTimer}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export const pomodoroTimerWidgetConfig: WidgetConfig = {
    type: 'base-pomodoro-timer',
    name: 'Pomodoro Timer',
    description: 'A simple Pomodoro timer to boost productivity.',
    version: '1.0.0',
    defaultSize: { width: 300, height: 300 },
    minSize: { width: 280, height: 300 },
    maxSize: { width: 400, height: 400 },
    component: PomodoroTimerWidget,
    icon: Timer,
    features: {
      resizable: true,
      fullscreenable: false,
      configurable: true,
    },
    configFields: {
      workDuration: {
        type: 'number',
        label: 'Work Duration (minutes)',
        defaultValue: 25,
        min: 5,
        max: 60,
      },
      breakDuration: {
        type: 'number',
        label: 'Break Duration (minutes)',
        defaultValue: 5,
        min: 1,
        max: 30,
      },
    },
    categories: ['Productivity'],
    tags: ['pomodoro', 'timer', 'productivity'],
    author: {
      name: 'Your Name',
    },
  }; 