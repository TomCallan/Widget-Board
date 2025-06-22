import React, { useState } from 'react';
import { WidgetProps } from '../types/widget';
import { StickyNote, Plus, X } from 'lucide-react';

export const NotesWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [notes, setNotes] = useState(widget.config.notes || [
    { id: 1, text: 'Remember to call client at 2pm', color: 'yellow' },
    { id: 2, text: 'Review quarterly reports', color: 'blue' }
  ]);
  const [newNote, setNewNote] = useState('');

  const colors = ['yellow', 'blue', 'green', 'pink', 'purple'];

  const addNote = () => {
    if (newNote.trim()) {
      const updatedNotes = [...notes, {
        id: Date.now(),
        text: newNote.trim(),
        color: colors[Math.floor(Math.random() * colors.length)]
      }];
      setNotes(updatedNotes);
      onUpdate(widget.id, { config: { ...widget.config, notes: updatedNotes } });
      setNewNote('');
    }
  };

  const removeNote = (id: number) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    onUpdate(widget.id, { config: { ...widget.config, notes: updatedNotes } });
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      yellow: 'bg-yellow-200/20 border-yellow-300/30 text-yellow-100',
      blue: 'bg-blue-200/20 border-blue-300/30 text-blue-100',
      green: 'bg-green-200/20 border-green-300/30 text-green-100',
      pink: 'bg-pink-200/20 border-pink-300/30 text-pink-100',
      purple: 'bg-purple-200/20 border-purple-300/30 text-purple-100'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.yellow;
  };

  return (
    <div className="h-full flex flex-col text-white">
      <div className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
            placeholder="Add a note..."
            className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={addNote}
            className="p-1 bg-purple-500 hover:bg-purple-600 rounded transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2">
        {notes.map(note => (
          <div key={note.id} className={`p-2 rounded-lg border ${getColorClasses(note.color)} relative group`}>
            <button
              onClick={() => removeNote(note.id)}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={8} />
            </button>
            <p className="text-sm pr-2">{note.text}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-center text-white/50 py-8">
            <StickyNote size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes yet</p>
          </div>
        )}
      </div>
    </div>
  );
};