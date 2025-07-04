import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStorageMode } from '../contexts/StorageModeContext';
import { StorageModeSelector } from './StorageModeSelector';
import { User, Cloud, HardDrive, ChevronDown, LogOut } from 'lucide-react';

export function UserProfile() {
  const { user, signOut } = useAuth();
  const { storageMode } = useStorageMode();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStorageModeSelector, setShowStorageModeSelector] = useState(false);

  if (!user) return null;

  const getStorageIcon = () => {
    return storageMode === 'cloud' ? (
      <Cloud className="h-4 w-4 text-blue-400" />
    ) : (
      <HardDrive className="h-4 w-4 text-gray-400" />
    );
  };

  const getStorageText = () => {
    return storageMode === 'cloud' ? 'Cloud' : 'Local';
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.username}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="h-6 w-6 text-white/70" />
          )}
          
          <div className="text-left min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {user.username}
            </div>
            <div className="flex items-center gap-1 text-xs text-white/60">
              {getStorageIcon()}
              <span>{getStorageText()}</span>
            </div>
          </div>
          
          <ChevronDown className="h-4 w-4 text-white/70" />
        </button>

        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl z-20">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white/70" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">
                      {user.full_name || user.username}
                    </div>
                    <div className="text-sm text-white/60 truncate">
                      @{user.username}
                    </div>
                    <div className="text-xs text-white/50">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <div className="mb-2">
                  <div className="px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wide">
                    Account
                  </div>
                  <div className="px-3 py-1 text-sm text-white/70">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.tier === 'premium' 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.tier === 'premium' ? '⭐ Premium' : '🆓 Free'}
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wide">
                    Storage
                  </div>
                  <button
                    onClick={() => {
                      setShowStorageModeSelector(true);
                      setShowDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10 rounded flex items-center gap-2"
                  >
                    {getStorageIcon()}
                    <span>{getStorageText()} Storage</span>
                    <span className="ml-auto text-xs text-white/50">Change</span>
                  </button>
                </div>

                <div className="border-t border-white/10 pt-2">
                  <button
                    onClick={async () => {
                      setShowDropdown(false);
                      await signOut();
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 rounded flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <StorageModeSelector
        isOpen={showStorageModeSelector}
        onClose={() => setShowStorageModeSelector(false)}
      />
    </>
  );
} 