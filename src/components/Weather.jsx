import React, { useState, useEffect } from "react";

export default function WeatherApp() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      setError(null);
      setWeather(null);
      setLoading(true);
      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        console.log("API Key:", apiKey);
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
          city
        )}&aqi=no`;
        console.log("Fetching URL:", url);
        const response = await fetch(url);
        const data = await response.json();
        console.log("Weather API response:", data);
        if (!response.ok || data.error)
          throw new Error(data.error?.message || "City not found");
        setWeather(data);
      } catch (err) {
        setError("Could not fetch weather. Please check the city name.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [city]);

  return (
    <div>
      <h1>Weather App</h1>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && !loading && (
        <div>
          <h2>{weather.location.name}</h2>
          <p>
            {weather.current.condition.text}, {weather.current.temp_c}°C
          </p>
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
          />
        </div>
      )}
    </div>
  );
}
