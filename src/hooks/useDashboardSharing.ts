import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { DashboardShare } from '../types/database';

export const useDashboardSharing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateShareToken = () => {
    return crypto.randomUUID() + '-' + Date.now().toString(36);
  };

  // Create a public share link for a dashboard
  const createPublicShare = async (dashboardId: string, permissions: 'view' | 'edit' = 'view', expiresInDays?: number) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const shareToken = generateShareToken();
      const expiresAt = expiresInDays 
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { data, error } = await supabase
        .from('dashboard_shares')
        .insert({
          dashboard_id: dashboardId,
          shared_by_user_id: user.id,
          share_token: shareToken,
          permissions,
          expires_at: expiresAt
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        shareUrl: `${window.location.origin}/shared/${shareToken}`,
        shareToken,
        permissions,
        expiresAt: data.expires_at
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create share';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Share dashboard with specific user
  const shareWithUser = async (dashboardId: string, username: string, permissions: 'view' | 'edit' = 'view') => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      // Find the user by username
      const { data: targetUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (userError || !targetUser) {
        throw new Error('User not found');
      }

      const { data, error } = await supabase
        .from('dashboard_shares')
        .insert({
          dashboard_id: dashboardId,
          shared_by_user_id: user.id,
          shared_with_user_id: targetUser.id,
          permissions
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to share with user';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Get all shares for a dashboard
  const getDashboardShares = async (dashboardId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('dashboard_shares')
        .select(`
          *,
          shared_with_user:users!dashboard_shares_shared_with_user_id_fkey(username, avatar_url)
        `)
        .eq('dashboard_id', dashboardId)
        .eq('shared_by_user_id', user.id);

      if (error) throw error;

      return data as (DashboardShare & {
        shared_with_user?: { username: string; avatar_url: string | null };
      })[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get shares';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Get dashboards shared with current user
  const getSharedWithMe = async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('dashboard_shares')
        .select(`
          *,
          dashboard:dashboards(id, name, color_scheme, updated_at),
          shared_by_user:users!dashboard_shares_shared_by_user_id_fkey(username, avatar_url)
        `)
        .eq('shared_with_user_id', user.id);

      if (error) throw error;

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get shared dashboards';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Get dashboard by share token (for public access)
  const getDashboardByToken = async (shareToken: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('dashboard_shares')
        .select(`
          *,
          dashboard:dashboards(*)
        `)
        .eq('share_token', shareToken)
        .single();

      if (error) throw error;

      // Check if share has expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        throw new Error('Share link has expired');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access shared dashboard';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Remove a share
  const removeShare = async (shareId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('dashboard_shares')
        .delete()
        .eq('id', shareId)
        .eq('shared_by_user_id', user.id);

      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove share';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update share permissions
  const updateSharePermissions = async (shareId: string, permissions: 'view' | 'edit') => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('dashboard_shares')
        .update({ permissions })
        .eq('id', shareId)
        .eq('shared_by_user_id', user.id);

      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update permissions';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPublicShare,
    shareWithUser,
    getDashboardShares,
    getSharedWithMe,
    getDashboardByToken,
    removeShare,
    updateSharePermissions
  };
}; 