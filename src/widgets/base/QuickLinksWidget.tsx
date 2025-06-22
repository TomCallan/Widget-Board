import React from 'react';
import { WidgetProps, WidgetConfig } from '../../types/widget';
import { ExternalLink, Mail, Calendar, FileText, Github, Link } from 'lucide-react';

export const QuickLinksWidget: React.FC<WidgetProps> = ({ widget }) => {
  const links = [
    { name: 'Email', icon: Mail, url: 'mailto:', color: 'text-blue-400' },
    { name: 'Calendar', icon: Calendar, url: '#', color: 'text-green-400' },
    { name: 'Docs', icon: FileText, url: '#', color: 'text-yellow-400' },
    { name: 'GitHub', icon: Github, url: 'https://github.com', color: 'text-purple-400' },
  ];

  return (
    <div className="h-full text-white">
      <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
      <div className="grid grid-cols-2 gap-3">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="flex flex-col items-center p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105 group"
          >
            <link.icon className={`${link.color} mb-2 group-hover:scale-110 transition-transform`} size={24} />
            <span className="text-xs text-center">{link.name}</span>
            <ExternalLink className="opacity-0 group-hover:opacity-50 transition-opacity mt-1" size={10} />
          </a>
        ))}
      </div>
    </div>
  );
};

export const quickLinksWidgetConfig: WidgetConfig = {
  type: 'quicklinks',
  name: 'Quick Links',
  defaultSize: { width: 280, height: 200 },
  minSize: { width: 240, height: 180 },
  maxSize: { width: 320, height: 240 },
  component: QuickLinksWidget,
  icon: Link,
  description: 'Quick access to important links',
  features: {
    resizable: true,
    fullscreenable: false,
    hasSettings: true
  },
  version: '1.0.0',
  categories: ['Productivity']
};