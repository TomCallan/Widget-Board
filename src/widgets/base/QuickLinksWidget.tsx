import React, { useState } from 'react';
import { WidgetProps, WidgetConfig } from '../../types/widget';
import { 
  Grid, ExternalLink, LucideIcon, Plus,
  Github, Youtube, Twitter, Linkedin, Mail, 
  Chrome, Link2, Facebook, Instagram, MessageSquare,
  Video, FileText, BookOpen, Code, Terminal,
  Database, Server, Globe
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Dialog } from '../../components/common/Dialog';

interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: keyof typeof Icons;
}

interface QuickLinksConfig {
  links: QuickLink[] | string;
  columns: number;
  rows: number;
  showTitles: boolean;
  iconSize: number;
}

const defaultConfig: QuickLinksConfig = {
  links: [],
  columns: 3,
  rows: 2,
  showTitles: true,
  iconSize: 24,
};

// Common services with their icons
const commonServices = [
  { name: 'GitHub', icon: 'Github', urlPattern: 'github.com' },
  { name: 'YouTube', icon: 'Youtube', urlPattern: 'youtube.com' },
  { name: 'Twitter', icon: 'Twitter', urlPattern: 'twitter.com' },
  { name: 'LinkedIn', icon: 'Linkedin', urlPattern: 'linkedin.com' },
  { name: 'Email', icon: 'Mail', urlPattern: '@' },
  { name: 'Facebook', icon: 'Facebook', urlPattern: 'facebook.com' },
  { name: 'Instagram', icon: 'Instagram', urlPattern: 'instagram.com' },
  { name: 'Chat', icon: 'MessageSquare', urlPattern: 'chat' },
  { name: 'Stream', icon: 'Video', urlPattern: 'stream' },
  { name: 'Website', icon: 'Globe', urlPattern: 'www' },
  { name: 'Docs', icon: 'FileText', urlPattern: 'docs' },
  { name: 'Wiki', icon: 'BookOpen', urlPattern: 'wiki' },
  { name: 'Code', icon: 'Code', urlPattern: 'code' },
  { name: 'Terminal', icon: 'Terminal', urlPattern: 'terminal' },
  { name: 'Database', icon: 'Database', urlPattern: 'db' },
  { name: 'Server', icon: 'Server', urlPattern: 'server' },
] as const;

// Helper to get grid columns class
const getGridColsClass = (columns: number) => {
  const colsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };
  return colsMap[columns] || colsMap[3];
};

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: Omit<QuickLink, 'id'>) => void;
  position: number;
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onSave, position }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof Icons>('Link2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title || url,
      url: url.startsWith('http') ? url : `https://${url}`,
      icon: selectedIcon,
    });
    onClose();
    setUrl('');
    setTitle('');
    setSelectedIcon('Link2');
  };

  // Auto-detect service from URL
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (!title) {
      // Try to extract a title from the URL
      try {
        const urlObj = new URL(newUrl.startsWith('http') ? newUrl : `https://${newUrl}`);
        setTitle(urlObj.hostname.split('.')[0]);
      } catch {
        // Invalid URL, ignore
      }
    }
    // Auto-select icon based on URL
    for (const service of commonServices) {
      if (newUrl.toLowerCase().includes(service.urlPattern.toLowerCase())) {
        setSelectedIcon(service.icon as keyof typeof Icons);
        break;
      }
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Add Link (Position ${position + 1})`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://"
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">Title (Optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Link"
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Icon</label>
          <div className="grid grid-cols-6 gap-2">
            {commonServices.map(service => {
              const IconComponent = Icons[service.icon as keyof typeof Icons] as LucideIcon;
              return (
                <button
                  key={service.icon}
                  type="button"
                  onClick={() => setSelectedIcon(service.icon as keyof typeof Icons)}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    selectedIcon === service.icon 
                      ? 'bg-purple-500/30 text-purple-400 ring-2 ring-purple-500'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                  title={service.name}
                >
                  <IconComponent size={20} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
          >
            Add Link
          </button>
        </div>
      </form>
    </Dialog>
  );
};

interface QuickLinksWidgetProps extends WidgetProps {
  isConfiguring?: boolean;
}

export const QuickLinksWidget: React.FC<QuickLinksWidgetProps> = ({ widget, onUpdate, isConfiguring }) => {
  const [addingLinkIndex, setAddingLinkIndex] = useState<number | null>(null);
  
  const rawConfig: QuickLinksConfig = { ...defaultConfig, ...widget.config };
  
  // Parse links if they're stored as a string
  const config: QuickLinksConfig = {
    ...rawConfig,
    links: typeof rawConfig.links === 'string' ? 
      JSON.parse(rawConfig.links || '[]') : 
      (Array.isArray(rawConfig.links) ? rawConfig.links : [])
  };

  const totalSlots = config.rows * config.columns;
  const links = Array.isArray(config.links) ? config.links : [];

  const handleAddLink = (linkData: Omit<QuickLink, 'id'>, position: number) => {
    const newLink: QuickLink = {
      id: Date.now().toString(),
      ...linkData
    };

    // Create a new array with the link at the correct position
    const newLinks = [...links];
    newLinks[position] = newLink;

    onUpdate(widget.id, {
      ...widget,
      config: {
        ...config,
        links: typeof rawConfig.links === 'string' ? JSON.stringify(newLinks) : newLinks,
      },
    });
  };

  const handleRemoveLink = (position: number) => {
    const newLinks = [...links];
    newLinks[position] = undefined as any;
    // Filter out undefined values when saving
    const cleanLinks = newLinks.filter(Boolean);

    onUpdate(widget.id, {
      ...widget,
      config: {
        ...config,
        links: typeof rawConfig.links === 'string' ? JSON.stringify(cleanLinks) : cleanLinks,
      },
    });
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="h-full flex flex-col p-4">
        <div className={`grid ${getGridColsClass(config.columns)} gap-4 flex-1`}>
          {Array.from({ length: totalSlots }).map((_, index) => {
            const link = links[index];
            
            if (link) {
              const IconComponent = (Icons[link.icon] as LucideIcon) || ExternalLink;
              return (
                <div key={link.id} className="relative group">
                  <button
                    onClick={() => handleLinkClick(link.url)}
                    className="w-full h-full flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    <IconComponent
                      size={config.iconSize}
                      className="text-white/90 group-hover:scale-110 transition-transform duration-200"
                    />
                    {config.showTitles && (
                      <span className="mt-2 text-xs text-white/70 text-center">
                        {link.title}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                  >
                    ×
                  </button>
                </div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => setAddingLinkIndex(index)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-200"
              >
                <Plus size={24} className="text-white/50" />
                <span className="mt-2 text-xs text-white/50">
                  Add Link
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AddLinkModal
        isOpen={addingLinkIndex !== null}
        onClose={() => setAddingLinkIndex(null)}
        onSave={(linkData) => {
          if (addingLinkIndex !== null) {
            handleAddLink(linkData, addingLinkIndex);
          }
        }}
        position={addingLinkIndex ?? 0}
      />
    </>
  );
};

export const quickLinksWidgetConfig: WidgetConfig = {
  type: 'custom-quick-links',
  name: 'Quick Links',
  description: 'Customizable grid of quick links with icons',
  version: '1.0.0',
  component: QuickLinksWidget,
  icon: Grid,
  defaultSize: { width: 400, height: 300 },
  minSize: { width: 200, height: 200 },
  maxSize: { width: 800, height: 600 },
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: true,
  },
  configFields: {
    columns: {
      type: 'number',
      label: 'Grid Columns',
      description: 'Number of columns in the grid',
      defaultValue: 3,
      min: 1,
      max: 6,
    },
    rows: {
      type: 'number',
      label: 'Grid Rows',
      description: 'Number of rows in the grid',
      defaultValue: 2,
      min: 1,
      max: 6,
    },
    showTitles: {
      type: 'boolean',
      label: 'Show Titles',
      description: 'Display link titles below icons',
      defaultValue: true,
    },
    iconSize: {
      type: 'number',
      label: 'Icon Size',
      description: 'Size of the icons in pixels',
      defaultValue: 24,
      min: 16,
      max: 48,
    },
  },
  categories: ['Tools', 'Productivity'],
}; 