import { useNotifications, NotificationOptions } from '../contexts/NotificationContext';
import { WidgetConfig } from '../types/widget';

export interface WidgetNotificationOptions extends Omit<NotificationOptions, 'desktop' | 'sound'> {
  soundOptions?: {
    url?: string;
    volume?: number;
  };
}

const DEFAULT_NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

export const useWidgetNotifications = (widgetConfig: WidgetConfig) => {
  const { notify } = useNotifications();

  const sendNotification = (message: string, options: WidgetNotificationOptions = {}) => {
    const notificationFeatures = widgetConfig.features?.notifications;
    
    if (!notificationFeatures) {
      // If widget doesn't specify notification features, only show toast
      notify(message, options);
      return;
    }

    const notificationOptions: NotificationOptions = {
      ...options,
      desktop: notificationFeatures.desktop,
    };

    // Handle sound options
    if (notificationFeatures.sound) {
      if (options.soundOptions?.url) {
        notificationOptions.sound = {
          url: options.soundOptions.url,
          volume: options.soundOptions.volume
        };
      } else if (typeof notificationFeatures.sound === 'string') {
        notificationOptions.sound = notificationFeatures.sound;
      } else if (notificationFeatures.sound === true) {
        notificationOptions.sound = DEFAULT_NOTIFICATION_SOUND;
      }
    }

    notify(message, notificationOptions);
  };

  return { sendNotification };
}; 