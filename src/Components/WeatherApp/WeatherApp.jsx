import React, { useState, useEffect } from 'react';
import './WeatherApp.css';
import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';

const WeatherApp = () => {
  const API_KEY = '76758c2e86c42a6afccf552ad6e330aa';

  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState({
    city: '',
    temp: 0,
    humidity: 0,
    wind: 0,
    icon: cloud_icon
  });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const updateWeatherData = (data) => {
    const iconCode = data.weather[0].icon.toLowerCase();
    let iconImg = clear_icon;
    if (iconCode.startsWith('02')) iconImg = cloud_icon;
    else if (iconCode.startsWith('03') || iconCode.startsWith('04')) iconImg = drizzle_icon;
    else if (iconCode.startsWith('09') || iconCode.startsWith('10')) iconImg = rain_icon;
    else if (iconCode.startsWith('13')) iconImg = snow_icon;

    setWeatherData({
      city: data.name,
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: data.wind.speed,
      icon: iconImg
    });
  };

  const fetchWeather = async (url) => {
    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod === '404') {
        alert('City not found');
        return;
      }
      updateWeatherData(data);
    } catch (err) {
      console.error('Weather fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (cityInput)
      fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${API_KEY}`);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
      },
      () => console.warn('Location access denied')
    );
  }, []);

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <BsSunFill /> : <BsMoonFill />}
      </div>

      <div className='top-bar'>
        <input
          type="text"
          placeholder="Search Your City Here"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <div className="search-icon" onClick={handleSearch}>
          <img src={search_icon} alt="search" />
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <div className='weather-image'>
            <img src={weatherData.icon} alt="weather" />
          </div>
          <div className="weather-temp">{weatherData.temp}°C</div>
          <div className="weather-location">{weatherData.city}</div>

          <div className="data-container">
            <div className="element">
              <img src={humidity_icon} alt="humidity" className="icon" />
              <div className="data">
                <div>{weatherData.humidity}%</div>
                <div className="text">Humidity</div>
              </div>
            </div>
            <div className="element">
              <img src={wind_icon} alt="wind" className="icon" />
              <div className="data">
                <div>{weatherData.wind} Km/h</div>
                <div className="text">Wind Speed</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherApp;

