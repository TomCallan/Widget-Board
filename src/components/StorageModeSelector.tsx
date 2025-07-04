import React, { useState } from 'react';
import { useStorageMode } from '../contexts/StorageModeContext';
import { useAuth } from '../contexts/AuthContext';
import { Dialog } from './common/Dialog';
import { 
  Cloud, 
  Monitor, 
  AlertTriangle,
  RotateCw
} from 'lucide-react';

interface StorageModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StorageModeSelector({ isOpen, onClose }: StorageModeSelectorProps) {
  const { storageMode, isCloudAvailable, switchToLocal, switchToCloud } = useStorageMode();
  const { user } = useAuth();
  const [switching, setSwitching] = useState(false);

  const handleSwitchToCloud = async () => {
    try {
      setSwitching(true);
      await switchToCloud();
      onClose();
    } catch (error) {
      console.error('Error switching to cloud:', error);
      alert('Failed to switch to cloud storage. Please ensure you are signed in.');
    } finally {
      setSwitching(false);
    }
  };

  const handleSwitchToLocal = () => {
    switchToLocal();
    onClose();
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Storage Mode"
      size="lg"
    >
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-300">
          Choose how you want to store your dashboards and settings.
        </p>

        <div className="space-y-4">
          {/* Local Storage Option */}
          <div 
            className={`
              p-4 border-2 rounded-lg cursor-pointer transition-all
              ${storageMode === 'local' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }
            `}
            onClick={handleSwitchToLocal}
          >
            <div className="flex items-start space-x-3">
              <Monitor className="h-6 w-6 text-gray-600 dark:text-gray-300 mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Local Storage
                  {storageMode === 'local' && (
                    <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                      (Current)
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Store data locally on this device. Works offline, but data won't sync across devices.
                </p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  ✓ Works offline • ✓ Privacy focused • ✗ No sync • ✗ No sharing
                </div>
              </div>
            </div>
          </div>

          {/* Cloud Storage Option */}
          <div 
            className={`
              p-4 border-2 rounded-lg transition-all
              ${!isCloudAvailable 
                ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                : storageMode === 'cloud'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-pointer'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 cursor-pointer'
              }
            `}
            onClick={isCloudAvailable ? handleSwitchToCloud : undefined}
          >
            <div className="flex items-start space-x-3">
              <Cloud className="h-6 w-6 text-gray-600 dark:text-gray-300 mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Cloud Storage
                  {storageMode === 'cloud' && (
                    <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                      (Current)
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Store data in the cloud with real-time sync and sharing capabilities.
                </p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  ✓ Real-time sync • ✓ Cross-device • ✓ Sharing • ✓ Backup
                </div>
                
                {!isCloudAvailable && (
                  <div className="mt-3 flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">
                      {!user ? 'Sign in required' : 'Cloud storage not configured'}
                    </span>
                  </div>
                )}
              </div>
              {switching && (
                <RotateCw className="h-5 w-5 text-blue-500 animate-spin" />
              )}
            </div>
          </div>
        </div>

        {storageMode === 'local' && isCloudAvailable && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> You can switch to cloud storage to sync your data across devices 
              and enable sharing features. Your local data will be migrated automatically.
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
} 