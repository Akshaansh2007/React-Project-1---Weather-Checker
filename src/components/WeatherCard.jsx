const WeatherCard = ({ weather, unit }) => {
  if (!weather) return null;

  const temp = unit === "C" ? weather.current.temp_c : weather.current.temp_f;
  const feelsLike =
    unit === "C" ? weather.current.feelslike_c : weather.current.feelslike_f;

  return (
    <div className="weather-card">
      <h2>
        {weather.location.name}, {weather.location.country}
      </h2>
      <p style={{ fontSize: 32 }}>
        {temp}° {unit}
      </p>
      <p>{weather.current.condition.text}</p>
      <img src={`https:${weather.current.condition.icon}`} alt="icon" />
      <p>
        Feels like: {feelsLike}° {unit}
      </p>
      <p>Humidity: {weather.current.humidity}%</p>
      <p>Wind: {weather.current.wind_kph} km/h</p>
      <p>Local Time: {weather.location.localtime}</p>
    </div>
  );
};

export default WeatherCard;