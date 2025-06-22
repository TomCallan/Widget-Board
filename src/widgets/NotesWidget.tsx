import React, { useState, useRef } from 'react';
import { WidgetProps } from '../types/widget';
import { 
  StickyNote, Plus, X, Search, Tag, Download, Upload, 
  Bold, Italic, Underline, List, Image as ImageIcon,
  ChevronDown, Check
} from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  format?: {
    bold?: boolean[];
    italic?: boolean[];
    underline?: boolean[];
  };
  images?: { url: string; caption?: string }[];
}

export const NotesWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [notes, setNotes] = useState<Note[]>(widget.config.notes || [
    {
      id: 1,
      title: 'Important Meeting',
      content: 'Remember to call client at 2pm',
      color: 'yellow',
      category: 'Work',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: 'Quarterly Review',
      content: 'Review quarterly reports',
      color: 'blue',
      category: 'Work',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    color: 'yellow',
    format: { bold: [], italic: [], underline: [] }
  });
  const [showFormatting, setShowFormatting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = ['yellow', 'blue', 'green', 'pink', 'purple'];
  const categories = Array.from(new Set(notes.map(note => note.category).filter(Boolean)));

  const addNote = () => {
    if (newNote.title?.trim() && newNote.content?.trim()) {
      const note: Note = {
        id: Date.now(),
        title: newNote.title.trim(),
        content: newNote.content.trim(),
        color: newNote.color || 'yellow',
        category: newNote.category,
        createdAt: new Date(),
        updatedAt: new Date(),
        format: newNote.format,
        images: newNote.images
      };

      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      onUpdate(widget.id, { config: { ...widget.config, notes: updatedNotes } });
      setNewNote({
        color: 'yellow',
        format: { bold: [], italic: [], underline: [] }
      });
      setShowNewNoteForm(false);
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewNote({
          ...newNote,
          images: [...(newNote.images || []), { url: reader.result as string }]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'notes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedNotes = JSON.parse(e.target?.result as string);
          const updatedNotes = [...notes, ...importedNotes];
          setNotes(updatedNotes);
          onUpdate(widget.id, { config: { ...widget.config, notes: updatedNotes } });
        } catch (error) {
          console.error('Error importing notes:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchTerm === '' || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatText = (type: 'bold' | 'italic' | 'underline') => {
    const content = newNote.content || '';
    const selectionStart = (document.activeElement as HTMLTextAreaElement)?.selectionStart || 0;
    const selectionEnd = (document.activeElement as HTMLTextAreaElement)?.selectionEnd || 0;
    
    const format = newNote.format || { bold: [], italic: [], underline: [] };
    const formatArray = [...(format[type] || [])];
    
    for (let i = selectionStart; i < selectionEnd; i++) {
      formatArray[i] = true;
    }
    
    setNewNote({
      ...newNote,
      format: {
        ...format,
        [type]: formatArray
      }
    });
  };

  return (
    <div className="h-full flex flex-col text-white">
      <div className="mb-3 space-y-2">
        {/* Search and Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <button
            onClick={exportNotes}
            className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
            title="Export Notes"
          >
            <Download size={14} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
            title="Import Notes"
          >
            <Upload size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importNotes}
            className="hidden"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
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

        {/* Add Note Button/Form */}
        {!showNewNoteForm ? (
          <button
            onClick={() => setShowNewNoteForm(true)}
            className="w-full px-2 py-1 text-sm bg-white/10 hover:bg-white/20 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={14} />
            Add Note
          </button>
        ) : (
          <div className="space-y-2 bg-white/5 p-2 rounded">
            <input
              type="text"
              value={newNote.title || ''}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Note title..."
              className="w-full px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <div className="flex gap-2">
              <input
                type="text"
                value={newNote.category ?? ''}
                onChange={(e) => setNewNote({ ...newNote, category: e.target.value === '' ? undefined : e.target.value })}
                placeholder="Category"
                className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              
              <select
                value={newNote.color || 'yellow'}
                onChange={(e) => setNewNote({ ...newNote, color: e.target.value })}
                className="px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {colors.map(color => (
                  <option key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Rich Text Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => formatText('bold')}
                className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                <Bold size={14} />
              </button>
              <button
                onClick={() => formatText('italic')}
                className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                <Italic size={14} />
              </button>
              <button
                onClick={() => formatText('underline')}
                className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                <Underline size={14} />
              </button>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (event) => {
                    if (event.target instanceof HTMLInputElement) {
                      handleImageUpload(event as unknown as React.ChangeEvent<HTMLInputElement>);
                    }
                  };
                  input.click();
                }}
                className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                <ImageIcon size={14} />
              </button>
            </div>

            <textarea
              value={newNote.content || ''}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Note content..."
              className="w-full px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 h-20"
            />

            {/* Image Previews */}
            {newNote.images && newNote.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {newNote.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={image.caption || `Image ${index + 1}`}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <button
                      onClick={() => setNewNote({
                        ...newNote,
                        images: newNote.images?.filter((_, i) => i !== index)
                      })}
                      className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={addNote}
                className="flex-1 py-1 bg-purple-500 hover:bg-purple-600 rounded text-sm transition-colors"
              >
                Add Note
              </button>
              <button
                onClick={() => {
                  setShowNewNoteForm(false);
                  setNewNote({
                    color: 'yellow',
                    format: { bold: [], italic: [], underline: [] }
                  });
                }}
                className="flex-1 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredNotes.map(note => (
          <div key={note.id} className={`p-2 rounded-lg border ${getColorClasses(note.color)} relative group`}>
            <button
              onClick={() => removeNote(note.id)}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={8} />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium">{note.title}</h3>
              {note.category && (
                <span className="text-xs px-1.5 py-0.5 bg-white/10 rounded-full flex items-center gap-1">
                  <Tag size={8} />
                  {note.category}
                </span>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            {note.images && note.images.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {note.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="h-16 w-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
            <div className="mt-2 text-xs text-white/50">
              {new Date(note.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <div className="text-center text-white/50 py-8">
            <StickyNote size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes found</p>
          </div>
        )}
      </div>
    </div>
  );
};