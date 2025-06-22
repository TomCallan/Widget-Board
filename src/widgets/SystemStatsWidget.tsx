import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../types/widget';
import { Cpu, HardDrive, Activity } from 'lucide-react';

export const SystemStatsWidget: React.FC<WidgetProps> = ({ widget }) => {
  const [stats, setStats] = useState({
    cpu: 45,
    memory: 60,
    disk: 75
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.max(0, Math.min(100, stats.cpu + (Math.random() - 0.5) * 20)),
        memory: Math.max(0, Math.min(100, stats.memory + (Math.random() - 0.5) * 10)),
        disk: Math.max(0, Math.min(100, stats.disk + (Math.random() - 0.5) * 5))
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [stats.cpu, stats.memory, stats.disk]);

  const StatBar = ({ label, value, icon: Icon, color }: { 
    label: string; 
    value: number; 
    icon: React.ComponentType<{ size?: number }>; 
    color: string;
  }) => (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon size={14} className={color} />
          <span className="text-sm text-white/80">{label}</span>
        </div>
        <span className="text-xs text-white/60">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            value > 80 ? 'bg-red-400' : value > 60 ? 'bg-yellow-400' : 'bg-green-400'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full text-white">
      <h3 className="text-lg font-semibold mb-4">System Stats</h3>
      <div className="space-y-2">
        <StatBar label="CPU" value={stats.cpu} icon={Cpu} color="text-blue-400" />
        <StatBar label="Memory" value={stats.memory} icon={Activity} color="text-green-400" />
        <StatBar label="Disk" value={stats.disk} icon={HardDrive} color="text-purple-400" />
      </div>
    </div>
  );
};