import React, { useState, useEffect } from 'react';
import { WidgetProps, WidgetConfig } from '../../types/widget';
import { Plus, Check, X, Calendar, Clock, ChevronDown, Tag, AlertCircle, RepeatIcon, FileText, CheckSquare } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  notes?: string;
  category?: string;
  repeat?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    nextDue?: Date;
  };
}

export const TodoWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [tasks, setTasks] = useState<Task[]>(widget.config.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState<string>('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [editTags, setEditTags] = useState<string>('');
  const [editNotes, setEditNotes] = useState('');
  const [editRepeat, setEditRepeat] = useState<'daily' | 'weekly' | 'monthly' | ''>('');

  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskData, setNewTaskData] = useState<Partial<Task>>({
    priority: 'medium',
    category: ''
  });

  const categories = Array.from(new Set(tasks.map(task => task.category).filter((cat): cat is string => Boolean(cat))));

  useEffect(() => {
    // Check for recurring tasks
    const now = new Date();
    const updatedTasks = tasks.map(task => {
      if (task.repeat && task.repeat.nextDue && new Date(task.repeat.nextDue) <= now) {
        const frequency = task.repeat.frequency;
        let nextDue = new Date(task.repeat.nextDue);
        
        switch (frequency) {
          case 'daily':
            nextDue.setDate(nextDue.getDate() + 1);
            break;
          case 'weekly':
            nextDue.setDate(nextDue.getDate() + 7);
            break;
          case 'monthly':
            nextDue.setMonth(nextDue.getMonth() + 1);
            break;
        }

        return {
          ...task,
          completed: false,
          repeat: {
            ...task.repeat,
            nextDue
          }
        };
      }
      return task;
    });

    if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
      setTasks(updatedTasks);
      onUpdate(widget.id, { config: { ...widget.config, tasks: updatedTasks } });
    }
  }, [tasks, widget.id, widget.config, onUpdate]);

  const addTodo = () => {
    if (newTaskData.text?.trim()) {
      const newTodo: Task = {
        id: Date.now().toString(),
        text: newTaskData.text.trim(),
        completed: false,
        category: newTaskData.category,
        dueDate: newTaskData.dueDate,
        priority: newTaskData.priority || 'medium',
        notes: newTaskData.notes,
        repeat: newTaskData.repeat
      };

      const updatedTasks = [...tasks, newTodo];
      setTasks(updatedTasks);
      onUpdate(widget.id, { config: { ...widget.config, tasks: updatedTasks } });
      setNewTaskData({ priority: 'medium' });
      setShowAddForm(false);
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    onUpdate(widget.id, { config: { ...widget.config, tasks: updatedTasks } });
  };

  const removeTodo = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    onUpdate(widget.id, { config: { ...widget.config, tasks: updatedTasks } });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const filteredTasks = selectedCategory
    ? tasks.filter(task => task.category === selectedCategory)
    : tasks;

  return (
    <div className="h-full flex flex-col text-white">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Tasks</h3>
          <div className="text-sm text-white/50">
            {calculateProgress()}% complete
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-3">
          <div
            className="h-1 bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-2 py-1 text-xs rounded ${
              !selectedCategory ? 'bg-purple-500' : 'bg-white/10'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                selectedCategory === category ? 'bg-purple-500' : 'bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Add Task Button/Form */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full px-2 py-1 text-sm bg-white/10 hover:bg-white/20 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={14} />
            Add Task
          </button>
        ) : (
          <div className="space-y-2 bg-white/5 p-2 rounded">
            <input
              type="text"
              value={newTaskData.text || ''}
              onChange={(e) => setNewTaskData({ ...newTaskData, text: e.target.value })}
              placeholder="Task description..."
              className="w-full px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            
            <div className="flex gap-2">
              <input
                type="text"
                              value={newTaskData.category || ''}
              onChange={(e) => setNewTaskData({ ...newTaskData, category: e.target.value || undefined })}
              placeholder="Category"
              className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              
              <select
                value={newTaskData.priority || 'medium'}
                onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as Task['priority'] })}
                className="px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                style={{ colorScheme: 'dark' }}
              >
                <option value="low" className="bg-gray-800 text-white">Low</option>
                <option value="medium" className="bg-gray-800 text-white">Medium</option>
                <option value="high" className="bg-gray-800 text-white">High</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="date"
                onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              
              <select
                value={newTaskData.repeat?.frequency ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setNewTaskData({
                      ...newTaskData,
                      repeat: undefined
                    });
                  } else {
                    setNewTaskData({
                      ...newTaskData,
                      repeat: {
                        frequency: value as 'daily' | 'weekly' | 'monthly',
                        nextDue: undefined
                      }
                    });
                  }
                }}
                className="px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                style={{ colorScheme: 'dark' }}
              >
                <option value="" className="bg-gray-800 text-white">Not recurring</option>
                <option value="daily" className="bg-gray-800 text-white">Daily</option>
                <option value="weekly" className="bg-gray-800 text-white">Weekly</option>
                <option value="monthly" className="bg-gray-800 text-white">Monthly</option>
              </select>
            </div>

            <textarea
              value={newTaskData.notes || ''}
              onChange={(e) => setNewTaskData({ ...newTaskData, notes: e.target.value })}
              placeholder="Add notes..."
              className="w-full px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 h-20"
            />

            <div className="flex gap-2">
              <button
                onClick={addTodo}
                className="flex-1 py-1 bg-purple-500 hover:bg-purple-600 rounded text-sm transition-colors"
              >
                Add Task
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewTaskData({ priority: 'medium' });
                }}
                className="flex-1 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1">
        {filteredTasks.map(task => (
          <div key={task.id} className="group bg-white/5 rounded p-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleTodo(task.id)}
                className={`p-1 rounded ${task.completed ? 'bg-green-500' : 'bg-white/10 border border-white/20'}`}
              >
                {task.completed && <Check size={12} />}
              </button>
              
              <div className="flex-1">
                <div className={`text-sm ${task.completed ? 'line-through text-white/50' : ''}`}>
                  {task.text}
                </div>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                  {task.category && (
                    <span className="flex items-center gap-1">
                      <Tag size={10} />
                      {task.category}
                    </span>
                  )}
                  
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                  
                  {task.repeat && (
                    <span className="flex items-center gap-1">
                      <RepeatIcon size={10} />
                      {task.repeat.frequency}
                    </span>
                  )}
                  
                  <span className={`flex items-center gap-1 ${getPriorityColor(task.priority || 'medium')}`}>
                    <AlertCircle size={10} />
                    {task.priority || 'Medium'}
                  </span>
                  
                  {task.notes && (
                    <span className="flex items-center gap-1">
                      <FileText size={10} />
                      notes
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => removeTodo(task.id)}
                className="p-1 text-white/50 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const todoWidgetConfig: WidgetConfig = {
  type: 'todo',
  name: 'Quick Tasks',
  defaultSize: { width: 320, height: 280 },
  minSize: { width: 280, height: 240 },
  maxSize: { width: 400, height: 400 },
  component: TodoWidget,
  icon: CheckSquare,
  description: 'Simple task management',
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: false
  },
  version: '1.0.0',
  categories: ['Productivity']
};