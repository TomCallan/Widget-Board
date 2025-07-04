import React, { useState } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Calculator } from 'lucide-react';

const CalculatorWidget: React.FC<WidgetProps> = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '=') {
      try {
        // Warning: eval can be dangerous. In a real-world scenario,
        // you'd want to use a safer expression parser.
        // For this controlled environment, it's a quick way to get functionality.
        // eslint-disable-next-line no-eval
        const evalResult = eval(input);
        setResult(String(evalResult));
      } catch (error) {
        setResult('Error');
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C'
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-grow flex flex-col justify-end mb-4">
        <input
          type="text"
          value={input}
          readOnly
          className="bg-transparent text-right text-white text-3xl w-full pr-2 font-mono"
          placeholder="0"
        />
        {result && (
          <div className="text-right text-accent-400 text-2xl w-full pr-2 font-mono">
            {result}
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className={`
              p-2 text-xl font-bold rounded-lg transition-colors text-white
              ${btn === 'C' ? 'col-span-4 bg-red-500 hover:bg-red-600' : 'bg-white/5 hover:bg-white/10'}
              ${['/', '*', '-', '+', '='].includes(btn) ? 'text-accent-400' : ''}
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export const calculatorWidgetConfig: WidgetConfig = {
  type: 'base-calculator',
  name: 'Calculator',
  description: 'A simple calculator widget.',
  version: '1.0.0',
  defaultSize: { width: 280, height: 340 },
  minSize: { width: 280, height: 340 },
  maxSize: { width: 280, height: 340 },
  component: CalculatorWidget,
  icon: Calculator,
  features: {
    resizable: true,
    fullscreenable: false,
    configurable: false,
  },
  categories: ['Tools'],
  tags: ['calculator', 'math'],
  author: {
    name: 'Your Name',
  },
}; 