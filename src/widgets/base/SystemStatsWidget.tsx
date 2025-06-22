import React, { useState, useEffect } from 'react';
import { WidgetProps, WidgetConfig } from '../../types/widget';
import { Cpu, HardDrive, Activity } from 'lucide-react';

interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
}

interface StatDisplayProps {
  label: string;
  value: number;
  Icon: React.FC<{ size?: number; className?: string }>;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, Icon }) => (
  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
    <div className="p-2 bg-purple-500/20 rounded">
      <Icon size={20} className="text-purple-400" />
    </div>
    <div>
      <div className="text-sm text-white/70">{label}</div>
      <div className="text-xl font-semibold">{value}%</div>
    </div>
  </div>
);

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

  return (
    <div className="h-full text-white">
      <h3 className="text-lg font-semibold mb-4">System Stats</h3>
      <div className="space-y-2">
        <StatDisplay label="CPU" value={stats.cpu} Icon={Cpu} />
        <StatDisplay label="Memory" value={stats.memory} Icon={Activity} />
        <StatDisplay label="Disk" value={stats.disk} Icon={HardDrive} />
      </div>
    </div>
  );
};

export const systemStatsWidgetConfig: WidgetConfig = {
  type: 'systemstats',
  name: 'System Stats',
  defaultSize: { width: 280, height: 200 },
  minSize: { width: 240, height: 180 },
  maxSize: { width: 320, height: 240 },
  component: SystemStatsWidget,
  icon: Activity,
  description: 'System performance monitoring',
  features: {
    resizable: true,
    fullscreenable: true,
    hasSettings: false
  },
  version: '1.0.0',
  categories: ['System']
};