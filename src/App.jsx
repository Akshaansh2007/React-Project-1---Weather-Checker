import { useState, useEffect } from "react";
import WeatherCard from "./components/WeatherCard"; 
import "./App.css";

const API_KEY = "2618207e60f34689b4e65252262302";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("weatherHistory"));
    if (savedHistory) setHistory(savedHistory);
  }, []);

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

      setHistory((prev) => {
        const updated = [query, ...prev.filter((c) => c !== query)];
        return updated.slice(0, 5);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  return (
    <div className="weather-container">
      <h1>☁️ Weather Checker</h1>

      {/* Input & Buttons */}
      <input
        className="weather-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        placeholder="Enter city"
      />
      <button className="weather-button" onClick={() => fetchWeather()}>
        Search
      </button>
      <button className="weather-button toggle" onClick={toggleUnit}>
        Toggle °C / °F
      </button>

      {loading && (
  <p style={{ color: "#1e3a8a", fontWeight: "500" }}>Fetching weather...</p>
)}
      {/* Weather Card */}
      {weather && <WeatherCard weather={weather} unit={unit} />}

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Recent Searches</h3>
          {history.map((h) => (
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