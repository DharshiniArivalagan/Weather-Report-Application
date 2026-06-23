import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Wind, Droplets, Cloud, CloudRain, Sun, Loader2, AlertCircle } from 'lucide-react';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('API Key is missing. Please add VITE_OPENWEATHER_API_KEY to your .env file.');
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      
      setWeatherData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('City not found. Please check the spelling and try again.');
      } else {
        setError(err.message || 'Failed to fetch weather data. Please try again later.');
      }
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clouds':
        return <Cloud className="w-24 h-24 text-slate-400 dark:text-slate-300 drop-shadow-lg" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-24 h-24 text-blue-400 drop-shadow-lg" />;
      case 'clear':
        return <Sun className="w-24 h-24 text-yellow-400 drop-shadow-lg" />;
      default:
        return <Cloud className="w-24 h-24 text-slate-400 dark:text-slate-300 drop-shadow-lg" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-panel p-8">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
          Weather Forecast
        </h1>

        <form onSubmit={fetchWeather} className="relative mb-8">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full py-4 pl-6 pr-14 glass-input font-medium"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-2 bottom-2 w-12 glass-button"
            aria-label="Search weather"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        {weatherData && !isLoading && (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 text-xl font-semibold mb-6 text-slate-700 dark:text-slate-200">
              <MapPin className="w-5 h-5 text-purple-500" />
              <span>{weatherData.name}, {weatherData.sys.country}</span>
            </div>

            <div className="mb-6 hover:scale-110 transition-transform duration-500 cursor-default">
              {getWeatherIcon(weatherData.weather[0]?.main)}
            </div>

            <div className="text-6xl font-bold text-slate-800 dark:text-white mb-2 drop-shadow-sm">
              {Math.round(weatherData.main.temp)}°C
            </div>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 capitalize font-medium mb-8">
              {weatherData.weather[0]?.description}
            </p>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-white/20 dark:bg-black/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Humidity</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{weatherData.main.humidity}%</p>
                </div>
              </div>

              <div className="bg-white/20 dark:bg-black/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Wind className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Wind Speed</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{Math.round(weatherData.wind.speed)} m/s</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
