import React, { useState, useEffect } from 'react';
import { Dialog } from './common/Dialog';
import { useDashboardSharing } from '../hooks/useDashboardSharing';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardUrl } from '../hooks/useDashboardUrl';
import { Dashboard } from '../types/widget';
import { Link, Copy, Trash2, Users, Share2, Clock, ExternalLink } from 'lucide-react';

interface DashboardSharingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dashboard: Dashboard;
}

export function DashboardSharingDialog({ isOpen, onClose, dashboard }: DashboardSharingDialogProps) {
  const { user } = useAuth();
  const { getCurrentDashboardUrl } = useDashboardUrl();
  const {
    loading,
    error,
    createPublicShare,
    shareWithUser,
    getDashboardShares,
    removeShare,
    updateSharePermissions
  } = useDashboardSharing();

  const [shares, setShares] = useState<any[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [sharePermissions, setSharePermissions] = useState<'view' | 'edit'>('view');
  const [expiryDays, setExpiryDays] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isOpen && dashboard) {
      loadShares();
    }
  }, [isOpen, dashboard]);

  const loadShares = async () => {
    try {
      const data = await getDashboardShares(dashboard.id);
      setShares(data || []);
    } catch (err) {
      console.error('Failed to load shares:', err);
    }
  };

  const handleCreatePublicShare = async () => {
    try {
      const result = await createPublicShare(dashboard.id, sharePermissions, expiryDays);
      await loadShares();
      
      // Copy URL to clipboard
      await navigator.clipboard.writeText(result.shareUrl);
      alert('Share link created and copied to clipboard!');
    } catch (err) {
      console.error('Failed to create share:', err);
      alert('Failed to create share link');
    }
  };

  const handleShareWithUser = async () => {
    if (!newUsername.trim()) return;

    try {
      await shareWithUser(dashboard.id, newUsername.trim(), sharePermissions);
      await loadShares();
      setNewUsername('');
      alert(`Tab shared with ${newUsername}!`);
    } catch (err) {
      console.error('Failed to share with user:', err);
      alert(err instanceof Error ? err.message : 'Failed to share with user');
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    try {
      await removeShare(shareId);
      await loadShares();
    } catch (err) {
      console.error('Failed to remove share:', err);
      alert('Failed to remove share');
    }
  };

  const handleCopyShareUrl = async (shareToken: string) => {
    const shareUrl = `${window.location.origin}/shared/${shareToken}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return 'Never expires';
    return `Expires ${new Date(dateString).toLocaleDateString()}`;
  };

  if (!user) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Share Tab "${dashboard.name}"`}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Your Tab URL Section */}
        <div className="space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <ExternalLink size={16} />
            Your Tab URL
          </h3>
          
          <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded-lg p-3">
            <input
              type="text"
              value={getCurrentDashboardUrl(dashboard)}
              readOnly
              className="flex-1 bg-transparent text-white/80 text-sm outline-none"
            />
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(getCurrentDashboardUrl(dashboard));
                  alert('Tab URL copied to clipboard!');
                } catch (error) {
                  console.error('Failed to copy URL:', error);
                  alert('Failed to copy URL to clipboard');
                }
              }}
              className="p-2 hover:bg-white/10 rounded text-white/60 hover:text-white"
              title="Copy URL"
            >
              <Copy size={14} />
            </button>
          </div>
          
          <p className="text-xs text-white/50">
            This is your personal tab URL. Anyone with this link can view your tab.
          </p>
        </div>

        {/* Create Public Link Section */}
        <div className="space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Link size={16} />
            Create Public Link
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-white/70 mb-1">Permissions</label>
              <select
                value={sharePermissions}
                onChange={(e) => setSharePermissions(e.target.value as 'view' | 'edit')}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
              >
                <option value="view">View Only</option>
                <option value="edit">Can Edit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Expires After (optional)</label>
              <select
                value={expiryDays || ''}
                onChange={(e) => setExpiryDays(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
              >
                <option value="">Never expires</option>
                <option value="1">1 day</option>
                <option value="7">1 week</option>
                <option value="30">1 month</option>
                <option value="90">3 months</option>
              </select>
            </div>

            <button
              onClick={handleCreatePublicShare}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-4 py-2 rounded font-medium"
            >
              Create Share Link
            </button>
          </div>
        </div>

        {/* Share with User Section */}
        <div className="space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Users size={16} />
            Share with User
          </h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50"
              onKeyPress={(e) => e.key === 'Enter' && handleShareWithUser()}
            />
            <button
              onClick={handleShareWithUser}
              disabled={loading || !newUsername.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-4 py-2 rounded"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Existing Shares */}
        <div className="space-y-4">
          <h3 className="text-white font-medium">Active Shares</h3>
          
          {shares.length === 0 ? (
            <p className="text-white/60 text-sm">No shares created yet</p>
          ) : (
            <div className="space-y-2">
              {shares.map((share) => (
                <div key={share.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {share.share_token ? (
                        <div className="flex items-center gap-2">
                          <Link size={14} className="text-blue-400" />
                          <span className="text-white/80 text-sm">Public link</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            share.permissions === 'edit' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {share.permissions}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-green-400" />
                          <span className="text-white/80 text-sm">
                            {share.shared_with_user?.username || 'Unknown user'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            share.permissions === 'edit' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {share.permissions}
                          </span>
                        </div>
                      )}
                      
                      {share.expires_at && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-white/50">
                          <Clock size={12} />
                          {formatExpiryDate(share.expires_at)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {share.share_token && (
                        <button
                          onClick={() => handleCopyShareUrl(share.share_token)}
                          className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white"
                          title="Copy link"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveShare(share.id)}
                        className="p-1 hover:bg-white/10 rounded text-red-400 hover:text-red-300"
                        title="Remove share"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
} 