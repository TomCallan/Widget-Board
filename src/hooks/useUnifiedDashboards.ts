import { useStorageMode } from '../contexts/StorageModeContext';
import { useDashboards as useLocalDashboards } from './useDashboards';
import { useSupabaseDashboards } from './useSupabaseDashboards';

export function useUnifiedDashboards() {
  const { storageMode } = useStorageMode();
  const localHook = useLocalDashboards();
  const cloudHook = useSupabaseDashboards();

  if (storageMode === 'cloud') {
    return cloudHook;
  } else {
    // For local mode, add the missing loading and error properties
    return {
      ...localHook,
      loading: false,
      error: null
    };
  }
} 