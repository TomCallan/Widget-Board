import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Github, GitPullRequest, GitBranch, Star, Book, GitFork } from 'lucide-react';

type GitHubEvent = {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  payload: {
    action?: string;
    ref_type?: string;
  };
  created_at: string;
};

const GitHubActivityWidget: React.FC<WidgetProps> = ({ widget: { config } }) => {
  const user = config.username || 'microsoft';
  const [activity, setActivity] = useState<GitHubEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://api.github.com/users/${user}/events/public`)
      .then(res => {
        if (!res.ok) throw new Error('User not found or API error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
            setActivity(data);
        } else {
            setError('Unexpected data format from GitHub API.');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const getEventType = (type: string) => {
    switch (type) {
        case 'PushEvent': return 'Pushed to';
        case 'PullRequestEvent': return 'Opened PR in';
        case 'CreateEvent': return 'Created branch in';
        case 'WatchEvent': return 'Starred';
        case 'ForkEvent': return 'Forked';
        default: return type;
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="p-4 h-full flex flex-col text-white">
      <h3 className="text-lg font-bold mb-2">GitHub Activity for <span className="text-accent-400">{user}</span></h3>
      {loading && <div className="text-center text-white/50">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <ul className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-transparent">
          {activity.map(event => (
            <li key={event.id} className="py-2 border-b border-white/10 text-sm">
              <span className="font-bold text-accent-400">{getEventType(event.type)}</span> on <a href={event.repo.url.replace('api.github.com/repos', 'github.com')} target="_blank" rel="noopener noreferrer" className="hover:underline">{event.repo.name}</a>
              <span className="text-white/50 ml-2">({timeAgo(event.created_at)})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const gitHubActivityWidgetConfig: WidgetConfig = {
  type: 'base-github-activity',
  name: 'GitHub Activity',
  description: 'Displays recent activity for a GitHub user.',
  version: '1.0.0',
  defaultSize: { width: 320, height: 280 },
  minSize: { width: 280, height: 240 },
  maxSize: { width: 600, height: 800 },
  component: GitHubActivityWidget,
  icon: Github,
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: true,
  },
  configFields: {
    username: {
      type: 'text',
      label: 'GitHub Username',
      description: 'The GitHub username to display activity for.',
      defaultValue: 'microsoft',
    },
  },
  categories: ['Information'],
  tags: ['github', 'git', 'development'],
  author: {
    name: 'Your Name',
  },
}; 