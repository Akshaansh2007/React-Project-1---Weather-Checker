import { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "2618207e60f34689b4e65252262302"; // your WeatherAPI.com key

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C"); // "C" or "F"
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("weatherHistory"));
    if (savedHistory) setHistory(savedHistory);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }, [history]);

  const fetchWeather = async (cityToFetch = city) => {
    const query = cityToFetch.trim();
    if (!query) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=no`
      );
      const data = await res.json();

      if (data.error) throw new Error(data.error.message || "City not found");

      setWeather(data);

      // Update history
      setHistory(prev => {
        const updated = [query, ...prev.filter(c => c !== query)];
        return updated.slice(0, 5);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle °C / °F
  const toggleUnit = () => {
    setUnit(prev => (prev === "C" ? "F" : "C"));
  };

  const getTemperature = () => {
    if (!weather) return "";
    return unit === "C"
      ? weather.current.temp_c
      : weather.current.temp_f;
  };

  const getFeelsLike = () => {
    if (!weather) return "";
    return unit === "C"
      ? weather.current.feelslike_c
      : weather.current.feelslike_f;
  };

  return (
    <div className="weather-container">
      <h1>☁️ Weather Checker</h1>

      {/* Input & Buttons */}
      <input
        className="weather-input"
        value={city}
        onChange={e => setCity(e.target.value)}
        onKeyDown={e => e.key === "Enter" && fetchWeather()}
        placeholder="Enter city"
      />
      <button className="weather-button" onClick={() => fetchWeather()}>
        Search
      </button>
      <button className="weather-button toggle" onClick={toggleUnit}>
        Toggle °C / °F
      </button>

      {/* Loading / Error */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Weather Card */}
      {weather && (
        <div className="weather-card">
          <h2>{weather.location.name}, {weather.location.country}</h2>
          <p style={{ fontSize: 32 }}>
            {getTemperature()}° {unit}
          </p>
          <p>{weather.current.condition.text}</p>
          <img
            src={`https:${weather.current.condition.icon}`}
            alt="icon"
          />
          <p>Feels like: {getFeelsLike()}° {unit}</p>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Recent Searches</h3>
          {history.map(h => (
            <button
              key={h}
              className="history-button"
              onClick={() => fetchWeather(h)}
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;