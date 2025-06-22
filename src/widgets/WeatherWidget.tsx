import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../types/widget';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

export const WeatherWidget: React.FC<WidgetProps> = ({ widget }) => {
  const [weather, setWeather] = useState({
    temp: 72,
    condition: 'sunny',
    location: 'New York, NY',
    humidity: 65,
    feelsLike: 75
  });

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temp: prev.temp + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 10))
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="text-yellow-400" size={32} />;
      case 'cloudy':
        return <Cloud className="text-gray-300" size={32} />;
      case 'rainy':
        return <CloudRain className="text-blue-400" size={32} />;
      default:
        return <Sun className="text-yellow-400" size={32} />;
    }
  };

  return (
    <div className="h-full flex flex-col justify-between text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{Math.round(weather.temp)}°</div>
          <div className="text-xs text-white/70">Feels like {Math.round(weather.feelsLike)}°</div>
        </div>
        {getWeatherIcon()}
      </div>
      
      <div className="space-y-2">
        <div className="text-sm text-white/80 capitalize">{weather.condition}</div>
        <div className="text-xs text-white/60">{weather.location}</div>
        <div className="flex items-center gap-1 text-xs text-white/60">
          <Thermometer size={12} />
          Humidity: {Math.round(weather.humidity)}%
        </div>
      </div>
    </div>
  );
};