import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { HardDrive, Wifi, Cpu, Activity } from 'lucide-react';

// Define types for the monitor data
interface MemoryInfo {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
}

declare global {
    interface Navigator {
        connection?: NetworkInfo;
    }
}

interface NetworkInfo extends EventTarget {
    type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
    downlink?: number;
    rtt?: number;
}

interface StorageInfo {
    quota: number;
    usage: number;
}

const SystemMonitorWidget: React.FC<WidgetProps> = () => {
  const [memory, setMemory] = useState<MemoryInfo | null>(null);
  const [network, setNetwork] = useState<Partial<NetworkInfo> | null>(null);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  
  useEffect(() => {
    // Memory
    if ('memory' in performance) {
      // This is a non-standard property, but available in Chrome
      // @ts-ignore
      setMemory(performance.memory);
    }

    // Network
    const connection = navigator.connection as NetworkInfo | undefined;
    if (connection) {
      const getNetworkInfo = () => ({
        type: connection.type,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
      });
      setNetwork(getNetworkInfo());
      
      const updateNetwork = () => setNetwork(getNetworkInfo());
      connection.addEventListener('change', updateNetwork);
      return () => connection.removeEventListener('change', updateNetwork);
    }
    
    // Storage
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
            setStorage({
                quota: estimate.quota || 0,
                usage: estimate.usage || 0,
            });
        });
    }

  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
  };

  return (
    <div className="p-4 h-full flex flex-col justify-around text-white">
        <div className="flex items-center">
            <Cpu size={20} className="mr-3 text-accent-400" />
            <div>
                <span className="font-bold">Memory</span>
                {memory ? (
                    <div className="text-sm text-white/70">
                        {formatBytes(memory.usedJSHeapSize)} / {formatBytes(memory.jsHeapSizeLimit)}
                    </div>
                ) : <div className="text-sm text-white/50">Not available</div>}
            </div>
        </div>
        <div className="flex items-center">
            <Wifi size={20} className="mr-3 text-accent-400" />
            <div>
                <span className="font-bold">Network</span>
                {network ? (
                    <div className="text-sm text-white/70">
                        {network.effectiveType}, {network.downlink} Mbps
                    </div>
                ) : <div className="text-sm text-white/50">Not available</div>}
            </div>
        </div>
        <div className="flex items-center">
            <HardDrive size={20} className="mr-3 text-accent-400" />
            <div>
                <span className="font-bold">Storage</span>
                {storage ? (
                    <div className="text-sm text-white/70">
                        {formatBytes(storage.usage)} / {formatBytes(storage.quota)}
                    </div>
                ) : <div className="text-sm text-white/50">Not available</div>}
            </div>
        </div>
    </div>
  );
};

export const systemMonitorWidgetConfig: WidgetConfig = {
    type: 'base-system-monitor',
    name: 'System Monitor',
    description: 'Displays system information like memory, network, and storage.',
    version: '1.0.0',
    defaultSize: { width: 280, height: 200 },
    minSize: { width: 240, height: 180 },
    maxSize: { width: 400, height: 240 },
    component: SystemMonitorWidget,
    icon: Activity,
    features: {
      resizable: true,
      fullscreenable: false,
      configurable: false,
    },
    categories: ['Information', 'Tools'],
    tags: ['system', 'monitor', 'performance', 'memory', 'network'],
    author: {
      name: 'Your Name',
    },
}; 