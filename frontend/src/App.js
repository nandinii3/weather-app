import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import History from "./components/History";
import PMAccelerator from "./components/PMAccelerator";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("dark");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/weather");
      const data = await res.json();
      setRecords(data);
    } catch {
      console.error("Could not load history");
    }
  };

  const handleSearch = async (location) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/weather/live/${encodeURIComponent(location)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Location not found");
      setWeatherData({ ...data, searchedLocation: location });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!weatherData) return;
    try {
      const res = await fetch("http://localhost:5000/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: weatherData.searchedLocation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchRecords();
      alert("Saved to history!");
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  return (
    <div className="app-root">
      <div className="bg-layer" />
      <div className="content-wrap">
        <Header theme={theme} setTheme={setTheme} />
        <main className="main-content">
          <SearchBar onSearch={handleSearch} loading={loading} />
          {error && (
            <div className="error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <span>Fetching weather data...</span>
            </div>
          )}
          {weatherData && !loading && (
            <>
              <CurrentWeather data={weatherData} onSave={handleSave} />
              <Forecast forecast={weatherData.forecast} />
            </>
          )}
          <History records={records} onRefresh={fetchRecords} />
          <PMAccelerator />
        </main>
      </div>
    </div>
  );
}

export default App;