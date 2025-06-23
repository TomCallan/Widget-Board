import { useSettings } from '../contexts/SettingsContext';
import { AuthKey } from '../types/settings';

export function useAuthKeys() {
  const { settings } = useSettings();

  const getKeysByService = (service: string): AuthKey[] => {
    return settings.auth.keys.filter(key => key.service.toLowerCase() === service.toLowerCase());
  };

  const getKeyById = (id: string): AuthKey | undefined => {
    return settings.auth.keys.find(key => key.id === id);
  };

  const getKeyValue = (id: string): string | undefined => {
    return settings.auth.keys.find(key => key.id === id)?.key;
  };

  return {
    keys: settings.auth.keys,
    getKeysByService,
    getKeyById,
    getKeyValue,
  };
} 