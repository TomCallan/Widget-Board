import React from 'react';
import { COLOR_SCHEMES } from '../types/widget';
import { Dialog } from './common/Dialog';

interface ColorSchemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSchemeChange: (scheme: string) => void;
  currentScheme: string;
}

export function ColorSchemeDialog({
  isOpen,
  onClose,
  onColorSchemeChange,
  currentScheme,
}: ColorSchemeDialogProps) {
  const handleSelectScheme = (scheme: string) => {
    onColorSchemeChange(scheme);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Theme"
      size="md"
    >
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(COLOR_SCHEMES).map(([key, schemeData]) => (
          <button
            key={key}
            onClick={() => handleSelectScheme(key)}
            className={`p-4 rounded-lg transition-all duration-200 hover:scale-105 text-left group flex items-center justify-between
              ${
                currentScheme === key
                  ? `bg-${schemeData.accentColor}-500/20`
                  : 'bg-white/10'
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${schemeData.from} ${schemeData.via} ${schemeData.to}`}
              />
              <span className="text-white font-medium">
                {schemeData.name}
              </span>
            </div>
            {currentScheme === key && (
              <div
                className={`w-2 h-2 rounded-full bg-${schemeData.accentColor}-400`}
              />
            )}
          </button>
        ))}
      </div>
    </Dialog>
  );
} 