import { useAuth } from '../contexts/AuthContext';
import { Dashboard } from '../types/widget';

export function useDashboardUrl() {
  const { user } = useAuth();

  const generateDashboardUrl = (dashboard: Dashboard): string => {
    if (!user) {
      return window.location.origin;
    }

    // Create a unique URL pattern: /u/{username}/{dashboard-slug}
    const username = user.username || user.email?.split('@')[0] || user.id.slice(0, 8);
    const dashboardSlug = dashboard.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();

    return `${window.location.origin}/u/${username}/${dashboardSlug}`;
  };

  const generatePublicShareUrl = (shareToken: string): string => {
    return `${window.location.origin}/shared/${shareToken}`;
  };

  const getCurrentDashboardUrl = (dashboard: Dashboard): string => {
    if (!user) {
      return window.location.origin;
    }
    return generateDashboardUrl(dashboard);
  };

  const updateBrowserUrl = (dashboard: Dashboard) => {
    if (!user) return;

    const dashboardUrl = generateDashboardUrl(dashboard);
    const path = new URL(dashboardUrl).pathname;
    
    // Update browser URL without triggering navigation
    if (window.location.pathname !== path) {
      window.history.replaceState({ dashboardId: dashboard.id }, dashboard.name, path);
    }
  };

  return {
    generateDashboardUrl,
    generatePublicShareUrl,
    getCurrentDashboardUrl,
    updateBrowserUrl
  };
} 