import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('Mumbai'); 
  const [search, setSearch] = useState('');
  const [isCelsius, setIsCelsius] = useState(true);

  const API_KEY = '21937f7fa61c4d159e152858251002';

  const fetchWeather = async (location) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=yes`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
    setCity(search);
    setSearch(''); // Clears input after search
    }
  };

  return (
    <div className="weather-app">
    <div className="search-container">
    <form onSubmit={handleSearch}>
        <input 
        type="text" 
        placeholder="Search city..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
          />
      <button type="submit">Search</button>
      </form>
      </div>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}

        {weather && !loading && (
          <div className="card">
          <div className="header">
            <h1>{weather.location.name}</h1>
            <span>{weather.location.country}</span>
          </div>

          <div className="main-info">
            <img src={weather.current.condition.icon} alt="weather icon" />
            <div className="temp-section">
            <h2 className="temp">



                {isCelsius ? weather.current.temp_c : weather.current.temp_f}
                <span className="unit">°{isCelsius ? 'C' : 'F'}</span>
            </h2>
            <button className="toggle" onClick={() => setIsCelsius(!isCelsius)}>
                Switch to °{isCelsius ? 'F' : 'C'}
            </button>
          </div>
          </div>
          <p className="condition">{weather.current.condition.text}</p>
          <div className="stats">
          <div className="stat">
              <p>Humidity</p>
              <span>{weather.current.humidity}%</span>
          </div>
          <div className="stat">
              <p>Wind</p>
              <span>{weather.current.wind_kph} kph</span>
          </div>
          <div className="stat">
            <p>AQI</p>
            <span>{Math.round(weather.current.air_quality.pm2_5)}</span>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}