import { useState, useCallback } from 'react';
import { CalculatorMode, CalculatorHistory, CustomFunction, UnitConversion } from '../types/calculator';
import { evaluateExpression, convertUnit, formatNumber } from '../utils/calculatorUtils';
import { useLocalStorage } from './useLocalStorage';

interface UseCalculatorProps {
  widgetId: string;
}

export const useCalculator = ({ widgetId }: UseCalculatorProps) => {
  // Local state
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Persistent state
  const [history, setHistory] = useLocalStorage<CalculatorHistory[]>(`calculator-history-${widgetId}`, []);
  const [customFunctions, setCustomFunctions] = useLocalStorage<CustomFunction[]>(`calculator-functions-${widgetId}`, []);
  const [savedFormulas, setSavedFormulas] = useLocalStorage<string[]>(`calculator-formulas-${widgetId}`, []);

  // Unit conversion state
  const [unitConversion, setUnitConversion] = useState<UnitConversion | null>(null);

  const clearDisplay = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setWaitingForOperand(false);
  }, []);

  const addToDisplay = useCallback((value: string) => {
    if (waitingForOperand) {
      setDisplay(value);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? value : display + value);
    }
  }, [display, waitingForOperand]);

  const addToExpression = useCallback((value: string) => {
    setExpression(expression + value);
  }, [expression]);

  const calculateResult = useCallback(() => {
    try {
      const result = evaluateExpression(expression || display);
      const formattedResult = formatNumber(result);
      
      // Add to history
      setHistory(prev => [{
        expression: expression || display,
        result: formattedResult,
        timestamp: Date.now()
      }, ...prev.slice(0, 49)]); // Keep last 50 entries

      setDisplay(formattedResult);
      setExpression('');
      setWaitingForOperand(true);
      
      return formattedResult;
    } catch (error) {
      setDisplay('Error');
      setWaitingForOperand(true);
      return 'Error';
    }
  }, [display, expression, setHistory]);

  const performUnitConversion = useCallback((conversion: UnitConversion) => {
    try {
      const result = convertUnit(conversion);
      const formattedResult = formatNumber(result);
      
      setDisplay(formattedResult);
      setUnitConversion(conversion);
      
      // Add to history
      setHistory(prev => [{
        expression: `${conversion.value} ${conversion.fromUnit} to ${conversion.toUnit}`,
        result: formattedResult,
        timestamp: Date.now()
      }, ...prev.slice(0, 49)]);
      
      return formattedResult;
    } catch (error) {
      setDisplay('Error');
      return 'Error';
    }
  }, [setHistory]);

  const saveFormula = useCallback((formula: string) => {
    setSavedFormulas(prev => [...prev, formula]);
  }, [setSavedFormulas]);

  const saveCustomFunction = useCallback((func: CustomFunction) => {
    setCustomFunctions(prev => [...prev, func]);
  }, [setCustomFunctions]);

  const deleteHistoryEntry = useCallback((timestamp: number) => {
    setHistory(prev => prev.filter(entry => entry.timestamp !== timestamp));
  }, [setHistory]);

  const deleteCustomFunction = useCallback((id: string) => {
    setCustomFunctions(prev => prev.filter(func => func.id !== id));
  }, [setCustomFunctions]);

  const deleteSavedFormula = useCallback((formula: string) => {
    setSavedFormulas(prev => prev.filter(f => f !== formula));
  }, [setSavedFormulas]);

  return {
    display,
    expression,
    mode,
    history,
    customFunctions,
    savedFormulas,
    unitConversion,
    clearDisplay,
    addToDisplay,
    addToExpression,
    calculateResult,
    performUnitConversion,
    saveFormula,
    saveCustomFunction,
    deleteHistoryEntry,
    deleteCustomFunction,
    deleteSavedFormula,
    setMode,
    setUnitConversion,
  };
}; 