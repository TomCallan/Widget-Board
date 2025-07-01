import React, { useState } from 'react';
import { DashboardPage } from '../types/widget';
import { 
  Plus, 
  X, 
  Edit2, 
  Trash2, 
  LayoutDashboard, 
  Home,
  Briefcase,
  Coffee,
  Code,
  Music,
  Palette,
  Book,
  Gamepad2,
  Heart
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { icon: Home, name: 'Home' },
  { icon: Briefcase, name: 'Work' },
  { icon: Coffee, name: 'Personal' },
  { icon: Code, name: 'Development' },
  { icon: Music, name: 'Entertainment' },
  { icon: Palette, name: 'Creative' },
  { icon: Book, name: 'Study' },
  { icon: Gamepad2, name: 'Gaming' },
  { icon: Heart, name: 'Health' },
  { icon: LayoutDashboard, name: 'Custom' }
];

const AVAILABLE_COLORS = [
  { value: 'purple', class: 'bg-purple-500' },
  { value: 'blue', class: 'bg-blue-500' },
  { value: 'green', class: 'bg-green-500' },
  { value: 'yellow', class: 'bg-yellow-500' },
  { value: 'red', class: 'bg-red-500' },
  { value: 'pink', class: 'bg-pink-500' },
  { value: 'indigo', class: 'bg-indigo-500' },
  { value: 'teal', class: 'bg-teal-500' }
];

interface PageManagerProps {
  pages: DashboardPage[];
  currentPageId: string;
  onPageChange: (pageId: string) => void;
  onPageAdd: (page: DashboardPage) => void;
  onPageDelete: (pageId: string) => void;
}

export const PageManager: React.FC<PageManagerProps> = ({
  pages,
  currentPageId,
  onPageChange,
  onPageAdd,
  onPageDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<typeof AVAILABLE_ICONS[0]>(AVAILABLE_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState<typeof AVAILABLE_COLORS[0]>(AVAILABLE_COLORS[0]);

  const handleAddPage = () => {
    if (!newPageName.trim()) return;

    const newPage: DashboardPage = {
      id: Date.now().toString(),
      name: newPageName.trim(),
      widgets: [],
      icon: selectedIcon.icon,
      color: selectedColor.value
    };

    onPageAdd(newPage);
    setNewPageName('');
    setShowNewPageForm(false);
    setSelectedIcon(AVAILABLE_ICONS[0]);
    setSelectedColor(AVAILABLE_COLORS[0]);
  };

  const getPageColor = (page: DashboardPage) => {
    const color = page.color || 'purple';
    return AVAILABLE_COLORS.find(c => c.value === color)?.class || 'bg-purple-500';
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Page Tabs */}
      <div className="flex items-center gap-2 px-6 py-2 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="flex-1 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200
                ${currentPageId === page.id 
                  ? `${getPageColor(page)} text-white` 
                  : 'text-white/70 hover:bg-white/10'
                }
              `}
            >
              {page.icon && <page.icon size={16} />}
              <span className="text-sm font-medium whitespace-nowrap">{page.name}</span>
              {isEditing && pages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPageDelete(page.id);
                  }}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`
              p-1.5 rounded transition-colors
              ${isEditing ? 'bg-purple-500 text-white' : 'text-white/70 hover:bg-white/10'}
            `}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setShowNewPageForm(true)}
            className="p-1.5 text-white/70 hover:bg-white/10 rounded transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* New Page Form */}
      {showNewPageForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800/90 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">New Dashboard Page</h2>
              <button
                onClick={() => setShowNewPageForm(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Page Name
                </label>
                <input
                  type="text"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  placeholder="Enter page name"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVAILABLE_ICONS.map((icon) => (
                    <button
                      key={icon.name}
                      onClick={() => setSelectedIcon(icon)}
                      className={`
                        p-2 rounded-lg border transition-all duration-200
                        ${selectedIcon.name === icon.name
                          ? 'bg-purple-500 border-purple-400 text-white'
                          : 'border-white/20 text-white/70 hover:bg-white/10'
                        }
                      `}
                      title={icon.name}
                    >
                      <icon.icon size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Color Theme
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        w-8 h-8 rounded-full ${color.class} transition-all duration-200
                        ${selectedColor.value === color.value
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800'
                          : 'hover:scale-110'
                        }
                      `}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddPage}
                disabled={!newPageName.trim()}
                className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors mt-6"
              >
                Create Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 