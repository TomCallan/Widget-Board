import React, { useState, useEffect, useRef } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { FileText, Plus, Trash2, Edit3, Eye, Save, Search, Download, Upload } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface WidgetState {
  notes: Note[];
  activeNoteId: string | null;
  viewMode: 'edit' | 'preview';
  searchQuery: string;
}

const MarkdownNotesWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const defaultConfig: WidgetState = {
    notes: [],
    activeNoteId: null,
    viewMode: 'edit',
    searchQuery: ''
  };

  const config = {
    ...defaultConfig,
    ...widget.config
  };

  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateConfig = (updates: Partial<WidgetState>) => {
    onUpdate(widget.id, {
      config: { ...config, ...updates }
    });
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '# New Note\n\nStart writing your markdown here...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    updateConfig({
      notes: [newNote, ...config.notes],
      activeNoteId: newNote.id,
      viewMode: 'edit'
    });

    setCurrentTitle(newNote.title);
    setCurrentContent(newNote.content);
    setIsEditing(true);
  };

  const selectNote = (noteId: string) => {
    const note = config.notes.find(n => n.id === noteId);
    if (note) {
      updateConfig({ activeNoteId: noteId });
      setCurrentTitle(note.title);
      setCurrentContent(note.content);
      setIsEditing(false);
    }
  };

  const saveNote = () => {
    if (!config.activeNoteId) return;

    const updatedNotes = config.notes.map(note =>
      note.id === config.activeNoteId
        ? {
            ...note,
            title: currentTitle || 'Untitled',
            content: currentContent,
            updatedAt: new Date().toISOString()
          }
        : note
    );

    updateConfig({ notes: updatedNotes });
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = config.notes.filter(n => n.id !== noteId);
    const newActiveId = config.activeNoteId === noteId 
      ? (updatedNotes.length > 0 ? updatedNotes[0].id : null)
      : config.activeNoteId;

    updateConfig({
      notes: updatedNotes,
      activeNoteId: newActiveId
    });

    if (newActiveId) {
      const newActiveNote = updatedNotes.find(n => n.id === newActiveId);
      if (newActiveNote) {
        setCurrentTitle(newActiveNote.title);
        setCurrentContent(newActiveNote.content);
      }
    } else {
      setCurrentTitle('');
      setCurrentContent('');
    }
    setIsEditing(false);
  };

  const renderMarkdown = (markdown: string): string => {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-white">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2 text-white">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-3 text-white">$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em class="text-white">$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>');

    // Code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-sm font-mono text-blue-300">$1</code>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-white/5 p-3 rounded mt-2 mb-2 overflow-x-auto"><code class="text-sm font-mono text-green-300">$1</code></pre>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li class="ml-4 text-white/90">• $1</li>');
    html = html.replace(/^- (.+)$/gim, '<li class="ml-4 text-white/90">• $1</li>');
    html = html.replace(/^\d+\. (.+)$/gim, '<li class="ml-4 text-white/90 list-decimal">$1</li>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-white/30 pl-4 py-2 bg-white/5 text-white/80 italic">$1</blockquote>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="border-white/20 my-4">');

    return html;
  };

  const exportNote = () => {
    if (!config.activeNoteId) return;
    
    const note = config.notes.find(n => n.id === config.activeNoteId);
    if (!note) return;

    const blob = new Blob([note.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      
      const newNote: Note = {
        id: Date.now().toString(),
        title: fileName,
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      updateConfig({
        notes: [newNote, ...config.notes],
        activeNoteId: newNote.id
      });

      setCurrentTitle(newNote.title);
      setCurrentContent(newNote.content);
      setIsEditing(false);
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredNotes = config.notes.filter(note =>
    note.title.toLowerCase().includes(config.searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(config.searchQuery.toLowerCase())
  );

  const activeNote = config.notes.find(n => n.id === config.activeNoteId);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currentContent]);

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FileText size={16} />
              Notes
            </h3>
            <div className="flex gap-1">
              <button
                onClick={createNewNote}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
                title="New Note"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
                title="Import Note"
              >
                <Upload size={14} />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-2 top-2 text-white/50" />
            <input
              type="text"
              placeholder="Search notes..."
              value={config.searchQuery}
              onChange={(e) => updateConfig({ searchQuery: e.target.value })}
              className="w-full pl-8 pr-2 py-1.5 bg-white/10 border border-white/20 rounded text-sm text-white placeholder-white/50"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-3 text-white/50 text-sm text-center">
              {config.notes.length === 0 ? 'No notes yet' : 'No matching notes'}
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => selectNote(note.id)}
                className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${
                  config.activeNoteId === note.id ? 'bg-white/10' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm truncate">
                      {note.title}
                    </h4>
                    <p className="text-white/60 text-xs mt-1 line-clamp-2">
                      {note.content.replace(/[#*`\-]/g, '').substring(0, 60)}...
                    </p>
                    <div className="text-white/40 text-xs mt-1">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"
                    title="Delete Note"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeNote ? (
          <>
            {/* Note Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    className="w-full bg-transparent text-white font-semibold text-lg border-none outline-none"
                    placeholder="Note title..."
                  />
                ) : (
                  <h2 className="text-lg font-semibold text-white truncate">
                    {activeNote.title}
                  </h2>
                )}
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                {isEditing ? (
                  <button
                    onClick={saveNote}
                    className="p-1.5 bg-green-500 hover:bg-green-600 rounded transition-colors"
                    title="Save Note"
                  >
                    <Save size={14} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                      title="Edit Note"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => updateConfig({ 
                        viewMode: config.viewMode === 'edit' ? 'preview' : 'edit' 
                      })}
                      className={`p-1.5 rounded transition-colors ${
                        config.viewMode === 'preview' ? 'bg-blue-500' : 'hover:bg-white/10'
                      }`}
                      title={config.viewMode === 'edit' ? 'Preview' : 'Edit'}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={exportNote}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                      title="Export Note"
                    >
                      <Download size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 overflow-hidden">
              {isEditing || config.viewMode === 'edit' ? (
                <textarea
                  ref={textareaRef}
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  placeholder="Start writing your markdown here..."
                  className="w-full h-full p-4 bg-transparent text-white resize-none border-none outline-none font-mono text-sm leading-relaxed"
                  style={{ minHeight: '100%' }}
                />
              ) : (
                <div className="h-full overflow-y-auto p-4">
                  <div 
                    className="prose prose-invert max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(currentContent)
                    }}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/10 text-xs text-white/50 flex justify-between items-center">
              <span>
                Created: {new Date(activeNote.createdAt).toLocaleDateString()}
              </span>
              <span>
                Updated: {new Date(activeNote.updatedAt).toLocaleDateString()}
              </span>
              <span>
                {currentContent.length} characters
              </span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/50">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No note selected</p>
              <p className="text-sm">Create a new note or select an existing one</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input for importing */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.txt"
        onChange={importNote}
        className="hidden"
      />
    </div>
  );
};

export const markdownNotesConfig: WidgetConfig = {
  type: 'custom-markdown-notes',
  name: 'Markdown Notes',
  description: 'A simple note-taking widget with Markdown support and local storage',
  defaultSize: { width: 600, height: 400 },
  minSize: { width: 500, height: 300 },
  maxSize: { width: 1000, height: 800 },
  component: MarkdownNotesWidget,
  icon: FileText,
  version: '1.0.0',
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: false
  },
  categories: ['PRODUCTIVITY', 'TOOLS'],
  author: {
    name: 'Dash',
    email: 'support@dash.com'
  }
};