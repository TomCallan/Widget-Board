import React, { useState } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { KeyRound, ClipboardCopy, Check } from 'lucide-react';

const PasswordGeneratorWidget: React.FC<WidgetProps> = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const lowerCharset = 'abcdefghijklmnopqrstuvwxyz';
    const upperCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberCharset = '0123456789';
    const symbolCharset = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = lowerCharset;
    if (includeUppercase) charset += upperCharset;
    if (includeNumbers) charset += numberCharset;
    if (includeSymbols) charset += symbolCharset;

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 h-full flex flex-col justify-between text-white">
      <div>
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg mb-4">
          <span className="font-mono text-lg break-all">{password || 'Click Generate'}</span>
          <button onClick={copyToClipboard} className="ml-2 p-1 text-white/50 hover:text-white" disabled={!password}>
            {copied ? <Check className="text-accent-400" /> : <ClipboardCopy />}
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block mb-1 text-sm text-white/70">Length: {length}</label>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer range-thumb-accent-500"
            />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="upper" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} className="form-checkbox h-4 w-4 text-accent-500 rounded border-white/20 bg-white/5 focus:ring-accent-500" />
            <label htmlFor="upper" className="ml-2">Include Uppercase</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="numbers" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="form-checkbox h-4 w-4 text-accent-500 rounded border-white/20 bg-white/5 focus:ring-accent-500" />
            <label htmlFor="numbers" className="ml-2">Include Numbers</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="symbols" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="form-checkbox h-4 w-4 text-accent-500 rounded border-white/20 bg-white/5 focus:ring-accent-500" />
            <label htmlFor="symbols" className="ml-2">Include Symbols</label>
          </div>
        </div>
      </div>
      <button
        onClick={generatePassword}
        className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-2 px-4 rounded-lg mt-4 transition-colors"
      >
        Generate
      </button>
    </div>
  );
};

export const passwordGeneratorWidgetConfig: WidgetConfig = {
  type: 'base-password-generator',
  name: 'Password Generator',
  description: 'Generates secure, random passwords.',
  version: '1.0.0',
  defaultSize: { width: 300, height: 260 },
  minSize: { width: 280, height: 260 },
  maxSize: { width: 400, height: 260 },
  component: PasswordGeneratorWidget,
  icon: KeyRound,
  features: {
    resizable: true,
    fullscreenable: false,
    configurable: false,
  },
  categories: ['Tools'],
  tags: ['password', 'security', 'generator'],
  author: {
    name: 'Your Name',
  },
}; 