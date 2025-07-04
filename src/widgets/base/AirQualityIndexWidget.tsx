import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Wind } from 'lucide-react';

interface AqiData {
  status: string;
  data: {
    aqi: number;
    city: {
      name: string;
    };
    iaqi: {
      pm25?: { v: number };
      pm10?: { v: number };
      o3?: { v: number };
      no2?: { v: number };
      so2?: { v: number };
      co?: { v: number };
    };
  };
}

const AirQualityIndexWidget: React.FC<WidgetProps> = ({ widget: { config } }) => {
  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiKey = config.apiKey;

  useEffect(() => {
    if (!apiKey) {
      setError('API key not configured.');
      setLoading(false);
      return;
    }

    const fetchByGeo = (lat: number, lon: number) => {
        fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiKey}`)
            .then(res => res.json())
            .then(handleResponse)
            .catch(handleError);
    };

    const fetchByIp = () => {
        fetch(`https://api.waqi.info/feed/here/?token=${apiKey}`)
            .then(res => res.json())
            .then(handleResponse)
            .catch(handleError);
    };

    const handleResponse = (data: any) => {
        if (data.status === 'ok') {
            setAqiData(data);
        } else {
            setError(data.data || 'Could not fetch AQI data.');
        }
        setLoading(false);
    };

    const handleError = () => {
        setError('Failed to fetch AQI data.');
        setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(
      (position) => fetchByGeo(position.coords.latitude, position.coords.longitude),
      () => fetchByIp() // Fallback to IP-based location
    );
  }, [apiKey]);

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    if (aqi <= 300) return 'text-purple-400';
    return 'text-red-600';
  };
  
  const renderPollutant = (id: string, value?: { v: number }) => (
    value ? <div className="text-sm text-white/70">{id.toUpperCase()}: {value.v.toFixed(1)}</div> : null
  );

  return (
    <div className="p-4 h-full flex flex-col items-center justify-center text-white">
      <h3 className="text-lg font-bold mb-2">Air Quality</h3>
      {loading && <div className="text-white/50">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {aqiData?.data && (
        <>
          <div className="text-sm text-white/70">{aqiData.data.city.name}</div>
          <div className={`text-6xl font-bold ${getAqiColor(aqiData.data.aqi)}`}>
            {aqiData.data.aqi}
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-4 text-center">
            {renderPollutant('pm2.5', aqiData.data.iaqi.pm25)}
            {renderPollutant('pm10', aqiData.data.iaqi.pm10)}
            {renderPollutant('o3', aqiData.data.iaqi.o3)}
            {renderPollutant('no2', aqiData.data.iaqi.no2)}
            {renderPollutant('so2', aqiData.data.iaqi.so2)}
            {renderPollutant('co', aqiData.data.iaqi.co)}
          </div>
        </>
      )}
    </div>
  );
};

export const airQualityIndexWidgetConfig: WidgetConfig = {
    type: 'base-air-quality-index',
    name: 'Air Quality Index',
    description: 'Displays the current air quality index for your location.',
    version: '1.0.0',
    defaultSize: { width: 280, height: 220 },
    minSize: { width: 240, height: 220 },
    maxSize: { width: 400, height: 220 },
    component: AirQualityIndexWidget,
    icon: Wind,
    features: {
      resizable: true,
      fullscreenable: false,
      configurable: true,
    },
    configFields: {
        apiKey: {
            type: 'authKey',
            label: 'AQICN API Token',
            service: 'AQICN',
            description: 'Get a free token from aqicn.org/data-platform/token/',
        },
    },
    categories: ['Information'],
    tags: ['air quality', 'aqi', 'health', 'weather'],
    author: {
      name: 'Your Name',
    },
  }; 