import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationOptions {
  type?: NotificationType;
  duration?: number;
  sound?: string | {
    url: string;
    volume?: number;
  };
  desktop?: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: number;
}

interface NotificationContextType {
  notify: (message: string, options?: NotificationOptions) => void;
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [audioCache] = useState<Map<string, HTMLAudioElement>>(new Map());

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const playNotificationSound = useCallback((sound: NotificationOptions['sound']) => {
    if (!sound) return;

    const url = typeof sound === 'string' ? sound : sound.url;
    const volume = typeof sound === 'object' ? sound.volume ?? 1 : 1;

    try {
      let audio = audioCache.get(url);
      
      if (!audio) {
        audio = new Audio(url);
        audioCache.set(url, audio);
      }

      audio.volume = Math.min(1, Math.max(0, volume));
      
      // Reset the audio to the beginning if it's already playing
      audio.currentTime = 0;
      
      // Play the audio and handle any errors
      audio.play().catch(error => {
        console.warn('Failed to play notification sound:', error);
        // Remove from cache if the URL is invalid
        if (error.name === 'NotSupportedError' || error.name === 'NotAllowedError') {
          audioCache.delete(url);
        }
      });
    } catch (error) {
      console.warn('Error setting up notification sound:', error);
    }
  }, [audioCache]);

  const notify = useCallback((message: string, options: NotificationOptions = {}) => {
    const id = Math.random().toString(36).substring(2);
    const notification: Notification = {
      id,
      message,
      type: options.type || 'info',
      timestamp: Date.now(),
    };

    // Add notification to state
    setNotifications(prev => [...prev, notification]);

    // Play sound if specified
    if (options.sound) {
      playNotificationSound(options.sound);
    }

    // Show desktop notification if requested and permitted
    if (options.desktop) {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Dash Notification', {
              body: message,
              icon: '/favicon.ico' // You might want to update this path
            });
          }
        });
      }
    }

    // Auto-remove notification after duration
    const duration = options.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, [playNotificationSound, removeNotification]);

  return (
    <NotificationContext.Provider value={{ notify, notifications, removeNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`
              flex items-center gap-2 p-3 rounded-lg shadow-lg backdrop-blur-lg
              animate-slide-in
              ${notification.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
                notification.type === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-400' :
                notification.type === 'warning' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' :
                'bg-blue-500/20 border border-blue-500/30 text-blue-400'
              }
            `}
          >
            <span className="text-sm">{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}; 