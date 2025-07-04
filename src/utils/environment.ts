export function isWebEnvironment(): boolean {
  // Check if we're running in a web environment (not localhost or file://)
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Consider it a web environment if:
  // - Not localhost/127.0.0.1
  // - Not file:// protocol
  // - Not electron (if we add electron support later)
  return (
    protocol !== 'file:' &&
    hostname !== 'localhost' &&
    hostname !== '127.0.0.1' &&
    hostname !== '0.0.0.0' &&
    !hostname.includes('.local') &&
    !window.location.href.includes('app://')
  );
}

export function shouldRequireAuth(): boolean {
  // In web environment, require auth for data persistence
  // In local environment, allow localStorage only
  return isWebEnvironment();
}

export function isLocalInstallation(): boolean {
  return !isWebEnvironment();
}

export function getDefaultStorageMode(): 'local' | 'cloud' {
  // Check if Supabase is configured - if so, prefer cloud mode even on localhost
  const isSupabaseConfigured = !!(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  
  // If Supabase is configured, default to cloud mode for testing
  // Otherwise, web environment defaults to cloud, local installation defaults to local storage
  if (isSupabaseConfigured) {
    return 'cloud';
  }
  
  return isWebEnvironment() ? 'cloud' : 'local';
} 