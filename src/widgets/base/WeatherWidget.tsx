import React, { useState, useEffect } from 'react';
import { WidgetProps, WidgetConfig } from '../../types/widget';
import { Cloud, CloudRain, Sun, Loader2, Search } from 'lucide-react';
import { useWidgetNotifications } from '../../hooks/useWidgetNotifications';

interface WeatherConfig {
  city: string;
  units: 'metric' | 'imperial';
  apiKey: string;
}

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  city: string;
}

const defaultConfig: WeatherConfig = {
  city: 'London',
  units: 'metric',
  apiKey: '',
};

export const WeatherWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const config: WeatherConfig = { ...defaultConfig, ...widget.config };
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendNotification } = useWidgetNotifications(weatherWidgetConfig);
  const [searchCity, setSearchCity] = useState(config.city);

  const fetchWeather = async (city: string) => {
    if (!config.apiKey) {
      setError('Please configure your OpenWeatherMap API key');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${config.units}&appid=${config.apiKey}`
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      
      setWeather({
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        city: data.name,
      });

      // Save the successful city search
      if (city !== config.city) {
        onUpdate(widget.id, {
          ...widget,
          config: { ...config, city }
        });
      }
    } catch {
      setError('City not found or API error');
      sendNotification('Weather update failed', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(config.city);
    // Set up auto-refresh every 15 minutes
    const interval = setInterval(() => fetchWeather(config.city), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [config.city, config.units, config.apiKey]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
    }
  };

  const getWeatherIcon = () => {
    if (!weather?.icon) return <Cloud className="w-16 h-16 text-white/70" />;
    
    // Map OpenWeatherMap icon codes to Lucide icons
    const iconMap: Record<string, JSX.Element> = {
      '01d': <Sun className="w-16 h-16 text-yellow-400" />,
      '01n': <Sun className="w-16 h-16 text-white/70" />,
      '02d': <Cloud className="w-16 h-16 text-white/70" />,
      '02n': <Cloud className="w-16 h-16 text-white/70" />,
      '03d': <Cloud className="w-16 h-16 text-white/70" />,
      '03n': <Cloud className="w-16 h-16 text-white/70" />,
      '04d': <Cloud className="w-16 h-16 text-white/70" />,
      '04n': <Cloud className="w-16 h-16 text-white/70" />,
      '09d': <CloudRain className="w-16 h-16 text-blue-400" />,
      '09n': <CloudRain className="w-16 h-16 text-blue-400" />,
      '10d': <CloudRain className="w-16 h-16 text-blue-400" />,
      '10n': <CloudRain className="w-16 h-16 text-blue-400" />,
    };

    return iconMap[weather.icon] || <Cloud className="w-16 h-16 text-white/70" />;
  };

  if (!config.apiKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center text-white/70">
        <Cloud className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm mb-2">Please configure your OpenWeatherMap API key</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Search city..."
          className="flex-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white/90 placeholder-white/50 focus:outline-none focus:border-purple-500/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-lg bg-purple-500/30 text-white/90 hover:bg-purple-500/40 transition-colors disabled:opacity-50"
        >
          <Search size={20} />
        </button>
      </form>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-center text-white/70">
          <p className="text-sm">{error}</p>
        </div>
      ) : weather ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {getWeatherIcon()}
          
          <h2 className="text-2xl font-bold text-white/90 mt-4">
            {weather.temp}°{config.units === 'metric' ? 'C' : 'F'}
          </h2>
          
          <p className="text-sm text-white/70 capitalize mt-1">
            {weather.description}
          </p>
          
          <p className="text-sm text-white/90 mt-4">
            {weather.city}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-6 w-full">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-sm text-white/50 mb-1">Feels Like</p>
              <p className="text-lg text-white/90">
                {weather.feels_like}°{config.units === 'metric' ? 'C' : 'F'}
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-sm text-white/50 mb-1">Humidity</p>
              <p className="text-lg text-white/90">{weather.humidity}%</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const weatherWidgetConfig: WidgetConfig = {
  type: 'custom-weather',
  name: 'Weather',
  description: 'Display current weather conditions for any city',
  version: '1.0.0',
  component: WeatherWidget,
  icon: Cloud,
  defaultSize: { width: 300, height: 400 },
  minSize: { width: 240, height: 300 },
  maxSize: { width: 500, height: 600 },
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: true,
    notifications: {
      toast: true
    }
  },
  configFields: {
    apiKey: {
      type: 'text',
      label: 'OpenWeatherMap API Key',
      description: 'Enter your OpenWeatherMap API key',
      defaultValue: '',
    },
    city: {
      type: 'text',
      label: 'Default City',
      description: 'Default city to show weather for',
      defaultValue: 'London',
    },
    units: {
      type: 'select',
      label: 'Temperature Units',
      description: 'Choose between Celsius and Fahrenheit',
      defaultValue: 'metric',
      options: [
        { label: 'Celsius', value: 'metric' },
        { label: 'Fahrenheit', value: 'imperial' },
      ],
    },
  },
  categories: ['Weather'],
}; 