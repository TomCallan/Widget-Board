import { UnitCategory, UnitConversion } from '../types/calculator';

// Scientific functions
export const scientificFunctions = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  log: Math.log10,
  ln: Math.log,
  sqrt: Math.sqrt,
  pow: Math.pow,
  exp: Math.exp,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
};

// Unit conversion rates (base units: meters, kilograms, celsius, liters, seconds)
export const unitConversionRates: Record<UnitCategory, Record<string, number>> = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.34,
  },
  mass: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.453592,
    ounce: 0.0283495,
  },
  temperature: {
    celsius: 1,
    fahrenheit: 1,
    kelvin: 1,
  },
  volume: {
    liter: 1,
    milliliter: 0.001,
    gallon: 3.78541,
    quart: 0.946353,
    pint: 0.473176,
    cup: 0.236588,
  },
  time: {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
  },
};

// Temperature conversion requires special handling
export const convertTemperature = (value: number, from: string, to: string): number => {
  if (from === to) return value;

  let celsius: number;
  // Convert to Celsius first
  switch (from) {
    case 'fahrenheit':
      celsius = (value - 32) * (5/9);
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }

  // Convert from Celsius to target unit
  switch (to) {
    case 'fahrenheit':
      return (celsius * 9/5) + 32;
    case 'kelvin':
      return celsius + 273.15;
    default:
      return celsius;
  }
};

export const convertUnit = (conversion: UnitConversion): number => {
  const { category, fromUnit, toUnit, value } = conversion;

  if (category === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }

  const rates = unitConversionRates[category];
  if (!rates || !rates[fromUnit] || !rates[toUnit]) {
    throw new Error('Invalid units for conversion');
  }

  return (value * rates[fromUnit]) / rates[toUnit];
};

// Evaluate a mathematical expression safely
export const evaluateExpression = (expression: string): number => {
  // Remove any characters that aren't numbers, operators, or scientific functions
  const sanitizedExpression = expression.replace(/[^0-9+\-*/().a-zA-Z]/g, '');
  
  // Create a safe evaluation context with only allowed functions
  const context = {
    ...scientificFunctions,
    Math: undefined,
    eval: undefined,
    Function: undefined,
  };

  try {
    // Use Function constructor to create a safe evaluation environment
    const evalFunction = new Function(...Object.keys(context), `return ${sanitizedExpression}`);
    return evalFunction(...Object.values(context));
  } catch (error) {
    throw new Error('Invalid expression');
  }
};

// Format number for display
export const formatNumber = (num: number): string => {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return num.toPrecision(10).replace(/\.?0+$/, '');
}; 