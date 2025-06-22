export type CalculatorMode = 'basic' | 'scientific' | 'unit';

export type CalculatorHistory = {
  expression: string;
  result: string;
  timestamp: number;
};

export type CustomFunction = {
  id: string;
  name: string;
  expression: string;
  description?: string;
};

export type UnitCategory = 'length' | 'mass' | 'temperature' | 'volume' | 'time';

export type UnitConversion = {
  category: UnitCategory;
  fromUnit: string;
  toUnit: string;
  value: number;
};

export type CalculatorConfig = {
  history: CalculatorHistory[];
  customFunctions: CustomFunction[];
  savedFormulas: string[];
  mode: CalculatorMode;
}; 