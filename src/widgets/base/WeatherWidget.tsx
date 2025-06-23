import React, { useState, useEffect } from 'react';
import { WidgetProps, WidgetConfig } from '../../types/widget';
import { useAuthKeys } from '../../hooks/useAuthKeys';
import {
  Cloud, Sun, CloudRain, Thermometer, Wind, Droplets,
  MapPin, AlertTriangle, ChevronDown, ChevronRight, Plus,
  X, Settings, Map, History, RefreshCw
} from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  location: string;
  humidity: number;
  feelsLike: number;
  windSpeed: number;
  precipitation: number;
  alerts?: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    expires: Date;
  }[];
  forecast: {
    date: Date;
    temp: { min: number; max: number };
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
    precipitation: number;
  }[];
  historical?: {
    date: Date;
    temp: { min: number; max: number };
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  }[];
}

interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
  isDefault?: boolean;
}

export const WeatherWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const { getKeyValue } = useAuthKeys();
  const apiKey = widget.config.apiKey ? getKeyValue(widget.config.apiKey) : null;

  const [locations, setLocations] = useState<Location[]>(widget.config.locations || [
    { id: '1', name: 'New York, NY', lat: 40.7128, lon: -74.0060, isDefault: true },
    { id: '2', name: 'London, UK', lat: 51.5074, lon: -0.1278 }
  ]);

  const [selectedLocation, setSelectedLocation] = useState<string>(
    locations.find(loc => loc.isDefault)?.id || locations[0]?.id
  );

  const [weather, setWeather] = useState<Record<string, WeatherData>>(widget.config.weather || {
    '1': {
      temp: 72,
      condition: 'sunny',
      location: 'New York, NY',
      humidity: 65,
      feelsLike: 75,
      windSpeed: 8,
      precipitation: 0,
      alerts: [
        {
          type: 'Heat Advisory',
          severity: 'medium',
          message: 'High temperatures expected',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      ],
      forecast: [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          temp: { min: 68, max: 82 },
          condition: 'sunny',
          precipitation: 0
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          temp: { min: 65, max: 78 },
          condition: 'cloudy',
          precipitation: 20
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          temp: { min: 62, max: 75 },
          condition: 'rainy',
          precipitation: 80
        }
      ],
      historical: [
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          temp: { min: 65, max: 80 },
          condition: 'sunny'
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          temp: { min: 63, max: 77 },
          condition: 'cloudy'
        }
      ]
    }
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showHistorical, setShowHistorical] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(locationId => {
          const data = updated[locationId];
          updated[locationId] = {
            ...data,
            temp: data.temp + (Math.random() - 0.5) * 2,
            humidity: Math.max(0, Math.min(100, data.humidity + (Math.random() - 0.5) * 10)),
            windSpeed: Math.max(0, data.windSpeed + (Math.random() - 0.5) * 2)
          };
        });
        return updated;
      });
    }, 30000);

    // Example of how you would use the API key
    if (apiKey) {
      // Make API call using the key
      console.log('Would make API call with key:', apiKey);
    }

    return () => clearInterval(interval);
  }, [apiKey]);

  const getWeatherIcon = (condition: string, size = 32) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="text-yellow-400" size={size} />;
      case 'cloudy':
        return <Cloud className="text-gray-300" size={size} />;
      case 'rainy':
        return <CloudRain className="text-blue-400" size={size} />;
      case 'stormy':
        return <CloudRain className="text-purple-400" size={size} />;
      case 'snowy':
        return <Cloud className="text-white" size={size} />;
      default:
        return <Sun className="text-yellow-400" size={size} />;
    }
  };

  const addLocation = () => {
    if (newLocation.trim()) {
      // In a real app, we would geocode the location here
      const newLoc: Location = {
        id: Date.now().toString(),
        name: newLocation.trim(),
        lat: 0,
        lon: 0
      };

      const updatedLocations = [...locations, newLoc];
      setLocations(updatedLocations);
      onUpdate(widget.id, { config: { ...widget.config, locations: updatedLocations } });
      setNewLocation('');

      // Initialize weather data for new location
      setWeather(prev => ({
        ...prev,
        [newLoc.id]: {
          temp: 70,
          condition: 'sunny',
          location: newLoc.name,
          humidity: 60,
          feelsLike: 72,
          windSpeed: 5,
          precipitation: 0,
          forecast: [],
          historical: []
        }
      }));
    }
  };

  const removeLocation = (id: string) => {
    const updatedLocations = locations.filter(loc => loc.id !== id);
    setLocations(updatedLocations);
    onUpdate(widget.id, { config: { ...widget.config, locations: updatedLocations } });

    if (selectedLocation === id) {
      setSelectedLocation(updatedLocations[0]?.id);
    }

    setWeather(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const setDefaultLocation = (id: string) => {
    const updatedLocations = locations.map(loc => ({
      ...loc,
      isDefault: loc.id === id
    }));
    setLocations(updatedLocations);
    onUpdate(widget.id, { config: { ...widget.config, locations: updatedLocations } });
  };

  const currentWeather = weather[selectedLocation];

  if (!currentWeather) {
    return (
      <div className="h-full flex items-center justify-center text-white/50">
        <div className="text-center">
          <Cloud size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No weather data available</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col text-white">
      {/* Header with Location Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full appearance-none bg-transparent pr-8 text-sm font-medium focus:outline-none cursor-pointer"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/50" />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowMap(!showMap)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Weather Map"
          >
            <Map size={14} />
          </button>
          <button
            onClick={() => setShowHistorical(!showHistorical)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Historical Data"
          >
            <History size={14} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-2 bg-white/5 rounded">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Add location..."
              className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={addLocation}
              className="p-1 bg-purple-500 hover:bg-purple-600 rounded transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {locations.map(location => (
              <div key={location.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDefaultLocation(location.id)}
                    className={`w-2 h-2 rounded-full ${
                      location.isDefault ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  />
                  <span>{location.name}</span>
                </div>
                {locations.length > 1 && (
                  <button
                    onClick={() => removeLocation(location.id)}
                    className="text-white/50 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Map */}
      {showMap && (
        <div className="mb-4 aspect-video bg-white/5 rounded relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-white/50">
            Weather Map Placeholder
          </div>
        </div>
      )}

      {/* Current Weather */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-2xl font-bold">{Math.round(currentWeather.temp)}°</div>
          <div className="text-xs text-white/70">Feels like {Math.round(currentWeather.feelsLike)}°</div>
        </div>
        {getWeatherIcon(currentWeather.condition)}
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-1 text-sm text-white/70">
          <Wind size={14} />
          {Math.round(currentWeather.windSpeed)} mph
        </div>
        <div className="flex items-center gap-1 text-sm text-white/70">
          <Droplets size={14} />
          {Math.round(currentWeather.humidity)}%
        </div>
        <div className="flex items-center gap-1 text-sm text-white/70">
          <CloudRain size={14} />
          {Math.round(currentWeather.precipitation)}%
        </div>
      </div>

      {/* Weather Alerts */}
      {currentWeather.alerts && currentWeather.alerts.length > 0 && (
        <div className="mb-4">
          {currentWeather.alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-2 rounded mb-2 flex items-start gap-2 ${
                alert.severity === 'high'
                  ? 'bg-red-500/20'
                  : alert.severity === 'medium'
                  ? 'bg-yellow-500/20'
                  : 'bg-blue-500/20'
              }`}
            >
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium">{alert.type}</div>
                <div className="text-xs text-white/70">{alert.message}</div>
                <div className="text-xs text-white/50 mt-1">
                  Expires {formatDate(alert.expires)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Forecast */}
      {!showHistorical ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Forecast</h3>
            <button
              onClick={() => setShowHistorical(true)}
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Show Historical
            </button>
          </div>
          <div className="space-y-2">
            {currentWeather.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(day.condition, 16)}
                  <span className="text-sm">{formatDate(day.date)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-white/70">{Math.round(day.temp.min)}°</span>
                  {' - '}
                  <span>{Math.round(day.temp.max)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Historical</h3>
            <button
              onClick={() => setShowHistorical(false)}
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Show Forecast
            </button>
          </div>
          <div className="space-y-2">
            {currentWeather.historical?.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(day.condition, 16)}
                  <span className="text-sm">{formatDate(day.date)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-white/70">{Math.round(day.temp.min)}°</span>
                  {' - '}
                  <span>{Math.round(day.temp.max)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const weatherWidgetConfig: WidgetConfig = {
  type: 'weather',
  name: 'Weather',
  defaultSize: { width: 280, height: 180 },
  minSize: { width: 240, height: 160 },
  maxSize: { width: 320, height: 220 },
  component: WeatherWidget,
  icon: Cloud,
  description: 'Current weather conditions',
  features: {
    resizable: true,
    fullscreenable: false,
    hasSettings: true,
    configurable: true,
  },
  configFields: {
    apiKey: {
      type: 'authKey',
      label: 'Weather API Key',
      description: 'Select your OpenWeatherMap API key',
      service: 'OpenWeatherMap',
      required: true,
    },
    location: {
      type: 'text',
      label: 'Default Location',
      description: 'Enter a city name or coordinates',
      defaultValue: 'London, UK',
      required: true,
    },
    units: {
      type: 'select',
      label: 'Temperature Units',
      options: [
        { label: 'Celsius', value: 'metric' },
        { label: 'Fahrenheit', value: 'imperial' },
      ],
      defaultValue: 'metric',
      required: true,
    },
  },
  version: '1.0.0',
  categories: ['Information'],
};