import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../types/widget';
import { Plus, Check, X, Calendar, Clock, ChevronDown, Tag, AlertCircle, RepeatIcon, FileText } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  category?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    nextDue?: Date;
  };
}

export const TodoWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [todos, setTodos] = useState<Task[]>(widget.config.todos || [
    {
      id: 1,
      text: 'Review morning emails',
      completed: false,
      category: 'Work',
      priority: 'medium',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      text: 'Prepare for 10am meeting',
      completed: false,
      category: 'Work',
      priority: 'high',
      dueDate: new Date(),
      notes: 'Review Q3 metrics'
    },
    {
      id: 3,
      text: 'Update project status',
      completed: true,
      category: 'Work',
      priority: 'low'
    }
  ]);

  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskData, setNewTaskData] = useState<Partial<Task>>({
    priority: 'medium',
    category: ''
  });

  const categories = Array.from(new Set(todos.map(todo => todo.category).filter(Boolean)));

  useEffect(() => {
    // Check for recurring tasks
    const now = new Date();
    const updatedTodos = todos.map(todo => {
      if (todo.recurring?.nextDue && new Date(todo.recurring.nextDue) <= now) {
        const frequency = todo.recurring.frequency;
        let nextDue = new Date(todo.recurring.nextDue);
        
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
          ...todo,
          completed: false,
          recurring: {
            ...todo.recurring,
            nextDue
          }
        };
      }
      return todo;
    });

    if (JSON.stringify(updatedTodos) !== JSON.stringify(todos)) {
      setTodos(updatedTodos);
      onUpdate(widget.id, { config: { ...widget.config, todos: updatedTodos } });
    }
  }, [todos, widget.id, widget.config, onUpdate]);

  const addTodo = () => {
    if (newTaskData.text?.trim()) {
      const newTodo: Task = {
        id: Date.now(),
        text: newTaskData.text.trim(),
        completed: false,
        category: newTaskData.category,
        dueDate: newTaskData.dueDate,
        priority: newTaskData.priority || 'medium',
        notes: newTaskData.notes,
        recurring: newTaskData.recurring
      };

      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      onUpdate(widget.id, { config: { ...widget.config, todos: updatedTodos } });
      setNewTaskData({ priority: 'medium' });
      setShowAddForm(false);
    }
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    onUpdate(widget.id, { config: { ...widget.config, todos: updatedTodos } });
  };

  const removeTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    onUpdate(widget.id, { config: { ...widget.config, todos: updatedTodos } });
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
    if (todos.length === 0) return 0;
    const completed = todos.filter(todo => todo.completed).length;
    return Math.round((completed / todos.length) * 100);
  };

  const filteredTodos = selectedCategory
    ? todos.filter(todo => todo.category === selectedCategory)
    : todos;

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
                value={newTaskData.category ?? ''}
                onChange={(e) => setNewTaskData({ ...newTaskData, category: e.target.value || undefined })}
                placeholder="Category"
                className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              
              <select
                value={newTaskData.priority || 'medium'}
                onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as Task['priority'] })}
                className="px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="date"
                onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              
              <select
                value={newTaskData.recurring?.frequency ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setNewTaskData({
                      ...newTaskData,
                      recurring: undefined
                    });
                  } else {
                    setNewTaskData({
                      ...newTaskData,
                      recurring: {
                        frequency: value as Task['recurring']['frequency'],
                        nextDue: undefined
                      }
                    });
                  }
                }}
                className="px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Not recurring</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
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
        {filteredTodos.map(todo => (
          <div key={todo.id} className="group bg-white/5 rounded p-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`p-1 rounded ${todo.completed ? 'bg-green-500' : 'bg-white/10 border border-white/20'}`}
              >
                {todo.completed && <Check size={12} />}
              </button>
              
              <div className="flex-1">
                <div className={`text-sm ${todo.completed ? 'line-through text-white/50' : ''}`}>
                  {todo.text}
                </div>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                  {todo.category && (
                    <span className="flex items-center gap-1">
                      <Tag size={10} />
                      {todo.category}
                    </span>
                  )}
                  
                  {todo.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(todo.dueDate)}
                    </span>
                  )}
                  
                  {todo.recurring && (
                    <span className="flex items-center gap-1">
                      <RepeatIcon size={10} />
                      {todo.recurring.frequency}
                    </span>
                  )}
                  
                  <span className={`flex items-center gap-1 ${getPriorityColor(todo.priority)}`}>
                    <AlertCircle size={10} />
                    {todo.priority}
                  </span>
                  
                  {todo.notes && (
                    <span className="flex items-center gap-1">
                      <FileText size={10} />
                      notes
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => removeTodo(todo.id)}
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