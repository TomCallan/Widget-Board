import React from 'react';
import { useAuthKeys } from '../hooks/useAuthKeys';
import { Key, AlertCircle } from 'lucide-react';

interface AuthKeySelectProps {
  value: string;
  onChange: (value: string) => void;
  service?: string;
  className?: string;
  required?: boolean;
}

export const AuthKeySelect: React.FC<AuthKeySelectProps> = ({
  value,
  onChange,
  service,
  className = '',
  required = false,
}) => {
  const { keys } = useAuthKeys();
  const filteredKeys = service 
    ? keys.filter(key => key.service.toLowerCase() === service.toLowerCase())
    : keys;

  if (filteredKeys.length === 0) {
    return (
      <div className="flex items-center gap-2 p-2 bg-yellow-500/10 text-yellow-400 rounded-lg text-sm">
        <AlertCircle size={16} />
        <span>
          {service 
            ? `No ${service} API keys found. Add one in Settings.`
            : 'No API keys found. Add one in Settings.'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      >
        {!required && (
          <option value="">Select an API key</option>
        )}
        {filteredKeys.map((key) => (
          <option key={key.id} value={key.id}>
            {key.name} ({key.service})
          </option>
        ))}
      </select>
      {value && (
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <Key size={12} />
          <span>Using {filteredKeys.find(k => k.id === value)?.name}</span>
        </div>
      )}
    </div>
  );
}; 