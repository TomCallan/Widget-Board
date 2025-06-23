import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Calculator, ArrowUpDown, Thermometer, Weight, Ruler } from 'lucide-react';

interface ConversionUnit {
  name: string;
  symbol: string;
  factor: number; // conversion factor to base unit
}

interface ConversionCategory {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  baseUnit: string;
  units: ConversionUnit[];
}

const UnitConverterWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('1');
  const [outputValue, setOutputValue] = useState('');

  const categories: Record<string, ConversionCategory> = {
    length: {
      name: 'Length',
      icon: Ruler,
      baseUnit: 'meter',
      units: [
        { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
        { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
        { name: 'Meter', symbol: 'm', factor: 1 },
        { name: 'Kilometer', symbol: 'km', factor: 1000 },
        { name: 'Inch', symbol: 'in', factor: 0.0254 },
        { name: 'Foot', symbol: 'ft', factor: 0.3048 },
        { name: 'Yard', symbol: 'yd', factor: 0.9144 },
        { name: 'Mile', symbol: 'mi', factor: 1609.344 },
        { name: 'Nautical Mile', symbol: 'nmi', factor: 1852 }
      ]
    },
    weight: {
      name: 'Weight',
      icon: Weight,
      baseUnit: 'kilogram',
      units: [
        { name: 'Milligram', symbol: 'mg', factor: 0.000001 },
        { name: 'Gram', symbol: 'g', factor: 0.001 },
        { name: 'Kilogram', symbol: 'kg', factor: 1 },
        { name: 'Metric Ton', symbol: 't', factor: 1000 },
        { name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
        { name: 'Pound', symbol: 'lb', factor: 0.453592 },
        { name: 'Stone', symbol: 'st', factor: 6.35029 },
        { name: 'US Ton', symbol: 'ton', factor: 907.185 }
      ]
    },
    temperature: {
      name: 'Temperature',
      icon: Thermometer,
      baseUnit: 'celsius',
      units: [
        { name: 'Celsius', symbol: '°C', factor: 1 },
        { name: 'Fahrenheit', symbol: '°F', factor: 1 },
        { name: 'Kelvin', symbol: 'K', factor: 1 },
        { name: 'Rankine', symbol: '°R', factor: 1 }
      ]
    },
    area: {
      name: 'Area',
      icon: Calculator,
      baseUnit: 'square meter',
      units: [
        { name: 'Square Millimeter', symbol: 'mm²', factor: 0.000001 },
        { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
        { name: 'Square Meter', symbol: 'm²', factor: 1 },
        { name: 'Hectare', symbol: 'ha', factor: 10000 },
        { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
        { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
        { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
        { name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
        { name: 'Acre', symbol: 'ac', factor: 4046.86 },
        { name: 'Square Mile', symbol: 'mi²', factor: 2589988.11 }
      ]
    },
    volume: {
      name: 'Volume',
      icon: Calculator,
      baseUnit: 'liter',
      units: [
        { name: 'Milliliter', symbol: 'ml', factor: 0.001 },
        { name: 'Liter', symbol: 'l', factor: 1 },
        { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
        { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
        { name: 'Cup (US)', symbol: 'cup', factor: 0.236588 },
        { name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
        { name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
        { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
        { name: 'Tablespoon', symbol: 'tbsp', factor: 0.0147868 },
        { name: 'Teaspoon', symbol: 'tsp', factor: 0.00492892 }
      ]
    },
    time: {
      name: 'Time',
      icon: Calculator,
      baseUnit: 'second',
      units: [
        { name: 'Nanosecond', symbol: 'ns', factor: 0.000000001 },
        { name: 'Microsecond', symbol: 'μs', factor: 0.000001 },
        { name: 'Millisecond', symbol: 'ms', factor: 0.001 },
        { name: 'Second', symbol: 's', factor: 1 },
        { name: 'Minute', symbol: 'min', factor: 60 },
        { name: 'Hour', symbol: 'h', factor: 3600 },
        { name: 'Day', symbol: 'd', factor: 86400 },
        { name: 'Week', symbol: 'wk', factor: 604800 },
        { name: 'Month', symbol: 'mo', factor: 2629746 },
        { name: 'Year', symbol: 'yr', factor: 31556952 }
      ]
    }
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius: number;
    switch (from) {
      case 'Fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'Kelvin':
        celsius = value - 273.15;
        break;
      case 'Rankine':
        celsius = (value - 491.67) * 5/9;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target
    switch (to) {
      case 'Fahrenheit':
        return celsius * 9/5 + 32;
      case 'Kelvin':
        return celsius + 273.15;
      case 'Rankine':
        return (celsius + 273.15) * 9/5;
      default:
        return celsius;
    }
  };

  const convertUnits = (value: number, fromUnitName: string, toUnitName: string, category: ConversionCategory): number => {
    if (category.name === 'Temperature') {
      return convertTemperature(value, fromUnitName, toUnitName);
    }

    const fromUnitData = category.units.find(u => u.name === fromUnitName);
    const toUnitData = category.units.find(u => u.name === toUnitName);

    if (!fromUnitData || !toUnitData) return 0;

    // Convert to base unit first, then to target unit
    const baseValue = value * fromUnitData.factor;
    return baseValue / toUnitData.factor;
  };

  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1e6 || (Math.abs(num) < 0.001 && num !== 0)) {
      return num.toExponential(6);
    }
    return parseFloat(num.toFixed(8)).toString();
  };

  useEffect(() => {
    const category = categories[selectedCategory];
    if (!fromUnit && category.units.length > 0) {
      setFromUnit(category.units[0].name);
    }
    if (!toUnit && category.units.length > 1) {
      setToUnit(category.units[1].name);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (inputValue && fromUnit && toUnit) {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        const category = categories[selectedCategory];
        const result = convertUnits(numValue, fromUnit, toUnit, category);
        setOutputValue(formatNumber(result));
      } else {
        setOutputValue('');
      }
    }
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setInputValue(outputValue);
  };

  const currentCategory = categories[selectedCategory];
  const fromUnitSymbol = currentCategory.units.find(u => u.name === fromUnit)?.symbol || '';
  const toUnitSymbol = currentCategory.units.find(u => u.name === toUnit)?.symbol || '';

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calculator size={20} className="text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Unit Converter</h3>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(categories).map(([key, category]) => {
          const IconComponent = category.icon;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`p-2 rounded text-xs flex flex-col items-center gap-1 transition-colors ${
                selectedCategory === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <IconComponent size={16} />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Conversion Interface */}
      <div className="space-y-3 flex-1">
        {/* From Unit */}
        <div className="space-y-2">
          <label className="text-sm text-white/70">From:</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
          >
            {currentCategory.units.map(unit => (
              <option key={unit.name} value={unit.name} className="bg-gray-800">
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value..."
              className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
            />
            <span className="text-white/70 text-sm min-w-0 max-w-16 truncate" title={fromUnitSymbol}>
              {fromUnitSymbol}
            </span>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapUnits}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowUpDown size={16} className="text-white/70" />
          </button>
        </div>

        {/* To Unit */}
        <div className="space-y-2">
          <label className="text-sm text-white/70">To:</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
          >
            {currentCategory.units.map(unit => (
              <option key={unit.name} value={unit.name} className="bg-gray-800">
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={outputValue}
              readOnly
              className="flex-1 bg-white/5 border border-white/20 rounded px-3 py-2 text-white font-mono"
              placeholder="Result will appear here..."
            />
            <span className="text-white/70 text-sm min-w-0 max-w-16 truncate" title={toUnitSymbol}>
              {toUnitSymbol}
            </span>
          </div>
        </div>

        {/* Quick Conversion Examples */}
        {inputValue && outputValue && (
          <div className="bg-white/5 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white/90 mb-2">Conversion</h4>
            <div className="text-sm text-white/70">
              <div className="flex justify-between items-center mb-1">
                <span>{inputValue} {fromUnitSymbol}</span>
                <span>=</span>
                <span>{outputValue} {toUnitSymbol}</span>
              </div>
              {parseFloat(inputValue) !== 1 && (
                <div className="flex justify-between items-center text-xs text-white/50">
                  <span>1 {fromUnitSymbol}</span>
                  <span>=</span>
                  <span>
                    {formatNumber(convertUnits(1, fromUnit, toUnit, currentCategory))} {toUnitSymbol}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Common Conversions for Selected Category */}
        <div className="bg-white/5 p-3 rounded-lg text-xs text-white/60">
          <h4 className="font-medium text-white/80 mb-2">Quick Reference</h4>
          <div className="space-y-1">
            {selectedCategory === 'length' && (
              <>
                <div>1 m = 100 cm = 1000 mm</div>
                <div>1 ft = 12 in = 0.3048 m</div>
                <div>1 mi = 1.609 km = 5280 ft</div>
              </>
            )}
            {selectedCategory === 'weight' && (
              <>
                <div>1 kg = 1000 g = 2.205 lb</div>
                <div>1 lb = 16 oz = 453.6 g</div>
                <div>1 t = 1000 kg = 2205 lb</div>
              </>
            )}
            {selectedCategory === 'temperature' && (
              <>
                <div>Water freezes: 0°C = 32°F = 273.15K</div>
                <div>Water boils: 100°C = 212°F = 373.15K</div>
                <div>Room temp: ~20°C = 68°F = 293K</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const unitConverterConfig: WidgetConfig = {
  type: 'custom-unit-converter',
  name: 'Unit Converter',
  description: 'Convert between different units of measurement including length, weight, temperature, area, volume, and time',
  defaultSize: { width: 350, height: 550 },
  minSize: { width: 300, height: 450 },
  maxSize: { width: 500, height: 700 },
  component: UnitConverterWidget,
  icon: Calculator,
  version: '1.0.0',
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: false
  },
  categories: ['TOOLS', 'PRODUCTIVITY'],
  author: {
    name: 'Dash',
    email: 'support@dash.com'
  }
};