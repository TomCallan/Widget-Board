import React, { useState } from 'react';
import { WidgetProps } from '../types/widget';
import { Plus, Check, X } from 'lucide-react';

export const TodoWidget: React.FC<WidgetProps> = ({ widget }) => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Review morning emails', completed: false },
    { id: 2, text: 'Prepare for 10am meeting', completed: false },
    { id: 3, text: 'Update project status', completed: true }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="h-full flex flex-col text-white">
      <div className="mb-3">
        <h3 className="text-lg font-semibold mb-2">Quick Tasks</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add task..."
            className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={addTodo}
            className="p-1 bg-purple-500 hover:bg-purple-600 rounded transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center gap-2 text-sm">
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`p-1 rounded ${todo.completed ? 'bg-green-500' : 'bg-white/10 border border-white/20'}`}
            >
              {todo.completed && <Check size={12} />}
            </button>
            <span className={`flex-1 ${todo.completed ? 'line-through text-white/50' : ''}`}>
              {todo.text}
            </span>
            <button
              onClick={() => removeTodo(todo.id)}
              className="p-1 text-white/50 hover:text-red-400 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};