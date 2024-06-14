import React, { useState, useEffect } from 'react';
import './App.css';
import { FaLocationCrosshairs } from "react-icons/fa6";

const App = () => {
  const [city, setCity] = useState('Denver');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiKey = "f1c40b7293d19b32a60711958f01c101";

  // Fetch weather data for a given city
  const fetchWeather = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        setWeather(data);
        setLoading(false);
      });

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
      .then((response) => {
        if (!response.ok) {
          alert("No forecast found.");
          throw new Error("No forecast found.");
        }
        return response.json();
      })
      .then((data) => {
        const dailyForecasts = [];
        for (let i = 0; i < data.list.length; i += 8) { // Get one forecast per day (every 24 hours)
          dailyForecasts.push(data.list[i]);
        }
        setForecast(dailyForecasts.slice(0, 5)); // Get the next 5 days
      });
  };

  // Fetch weather data based on current location
  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
          .then((response) => {
            if (!response.ok) {
              alert("No weather found.");
              throw new Error("No weather found.");
            }
            return response.json();
          })
          .then((data) => {
            setCity(data.name);
            setWeather(data);
            setLoading(false);
          });

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
          .then((response) => {
            if (!response.ok) {
              alert("No forecast found.");
              throw new Error("No forecast found.");
            }
            return response.json();
          })
          .then((data) => {
            const dailyForecasts = [];
            for (let i = 0; i < data.list.length; i += 8) { // Get one forecast per day (every 24 hours)
              dailyForecasts.push(data.list[i]);
            }
            setForecast(dailyForecasts.slice(0, 5)); // Get the next 5 days
          });
      }, (error) => {
        console.error("Error fetching location:", error);
        alert("Error fetching location.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = () => {
    const searchValue = document.querySelector(".search-bar").value;
    if (searchValue) {
      setCity(searchValue);
      setLoading(true);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="card main-card">
        <div className="search">
          <input type="text" className="search-bar" placeholder="Search" />
          <button onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button className="location-button" onClick={fetchWeatherByLocation}>
          <FaLocationCrosshairs className="location-icon" />
          {/* Replace with location symbol */}
          </button>
        </div>
        <div className={`weather ${loading ? 'loading' : ''}`}>
          {weather && !loading && (
            <>
              <h1 className="city">Weather in {weather.name}</h1>
              <h1 className="temp">{weather.main.temp}°C</h1>
              <div className="flex">
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="" className="icon" />
                <div className="description">{weather.weather[0].description}</div>
              </div>
              <div className="details">
                <div className="detail-item">
                  <i className="fas fa-tint"></i> Humidity: {weather.main.humidity}%
                </div>
                <div className="detail-item">
                  <i className="fas fa-wind"></i> Wind Speed: {weather.wind.speed.toFixed(2)} km/h
                </div>
                <div className="detail-item">
                  <i className="fas fa-tachometer-alt"></i> Pressure: {weather.main.pressure} hPa
                </div>
                <div className="detail-item">
                  <i className="fas fa-eye"></i> Visibility: {weather.visibility / 1000} km
                </div>
                <div className="detail-item">
                  <i className="far fa-clock"></i> Sunrise: {formatTime(weather.sys.sunrise)}
                </div>
                <div className="detail-item">
                  <i className="far fa-clock"></i> Sunset: {formatTime(weather.sys.sunset)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {forecast.length > 0 && (
        <div className="card forecast-container">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-card">
              <div className="weather">
                <h1 className="city">{new Date(day.dt_txt).toLocaleDateString()}</h1>
                <h1 className="temp">{day.main.temp}°C</h1>
                <div className="flex">
                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="" className="icon" />
                  <div className="description">{day.weather[0].description}</div>
                </div>
                <div className="details">
                  <div className="detail-item">
                    <i className="fas fa-tint"></i> Humidity: {day.main.humidity}%
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-wind"></i> Wind Speed: {day.wind.speed.toFixed(2)} km/h
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;