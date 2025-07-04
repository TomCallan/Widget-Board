import React from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { CheckSquare } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

const HabitTrackerWidget: React.FC<WidgetProps> = ({ widget }) => {
  const [habits, setHabits] = useLocalStorage<Habit[]>(`widget-${widget.id}-habits`, []);
  const [newHabit, setNewHabit] = React.useState('');

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      setHabits([...habits, { id: crypto.randomUUID(), name: newHabit.trim(), completed: false }]);
      setNewHabit('');
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const removeHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div className="p-4 h-full flex flex-col text-white">
      <h3 className="text-lg font-bold mb-2">Habit Tracker</h3>
      <form onSubmit={addHabit} className="flex mb-4">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit"
          className="flex-grow bg-white/5 border border-white/20 rounded-l-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
        <button type="submit" className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-2 px-4 rounded-r-lg transition-colors">
          Add
        </button>
      </form>
      <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-transparent">
        {habits.map(habit => (
          <div key={habit.id} className="flex items-center justify-between bg-white/5 p-2 rounded-lg mb-2">
            <span
              className={`cursor-pointer ${habit.completed ? 'line-through text-white/50' : ''}`}
              onClick={() => toggleHabit(habit.id)}
            >
              {habit.name}
            </span>
            <button
              onClick={() => removeHabit(habit.id)}
              className="text-red-500/70 hover:text-red-500 font-bold"
            >
              &times;
            </button>
          </div>
        ))}
        {habits.length === 0 && (
            <div className="text-center py-8 text-white/50">
                Add a habit to get started.
            </div>
        )}
      </div>
    </div>
  );
};

export const habitTrackerWidgetConfig: WidgetConfig = {
  type: 'base-habit-tracker',
  name: 'Habit Tracker',
  description: 'Track your daily habits and goals.',
  version: '1.0.0',
  defaultSize: { width: 280, height: 320 },
  minSize: { width: 240, height: 240 },
  maxSize: { width: 500, height: 600 },
  component: HabitTrackerWidget,
  icon: CheckSquare,
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: false,
  },
  categories: ['Productivity'],
  tags: ['habit', 'tracker', 'goals'],
  author: {
    name: 'Your Name',
  },
}; 