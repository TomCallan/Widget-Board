import React, { useState } from 'react';
import { WidgetProps } from '../types/widget';
import { Calculator, Delete } from 'lucide-react';

export const CalculatorWidget: React.FC<WidgetProps> = ({ widget }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const Button = ({ onClick, className = '', children }: { 
    onClick: () => void; 
    className?: string; 
    children: React.ReactNode; 
  }) => (
    <button
      onClick={onClick}
      className={`h-8 rounded bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="h-full flex flex-col text-white">
      {/* Display */}
      <div className="bg-black/20 rounded p-2 mb-3">
        <div className="text-right text-lg font-mono truncate">
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1 flex-1">
        <Button onClick={clear} className="bg-red-500/20 hover:bg-red-500/30">
          C
        </Button>
        <Button onClick={() => {}} className="bg-gray-500/20">
          ±
        </Button>
        <Button onClick={() => {}} className="bg-gray-500/20">
          %
        </Button>
        <Button onClick={() => inputOperation('÷')} className="bg-purple-500/20 hover:bg-purple-500/30">
          ÷
        </Button>

        <Button onClick={() => inputNumber('7')}>7</Button>
        <Button onClick={() => inputNumber('8')}>8</Button>
        <Button onClick={() => inputNumber('9')}>9</Button>
        <Button onClick={() => inputOperation('×')} className="bg-purple-500/20 hover:bg-purple-500/30">
          ×
        </Button>

        <Button onClick={() => inputNumber('4')}>4</Button>
        <Button onClick={() => inputNumber('5')}>5</Button>
        <Button onClick={() => inputNumber('6')}>6</Button>
        <Button onClick={() => inputOperation('-')} className="bg-purple-500/20 hover:bg-purple-500/30">
          -
        </Button>

        <Button onClick={() => inputNumber('1')}>1</Button>
        <Button onClick={() => inputNumber('2')}>2</Button>
        <Button onClick={() => inputNumber('3')}>3</Button>
        <Button onClick={() => inputOperation('+')} className="bg-purple-500/20 hover:bg-purple-500/30">
          +
        </Button>

        <Button onClick={() => inputNumber('0')} className="col-span-2">
          0
        </Button>
        <Button onClick={() => inputNumber('.')}>.</Button>
        <Button onClick={performCalculation} className="bg-purple-500 hover:bg-purple-600">
          =
        </Button>
      </div>
    </div>
  );
};