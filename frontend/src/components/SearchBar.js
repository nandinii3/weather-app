import React, { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onSearch(`${latitude},${longitude}`);
        setGpsLoading(false);
      },
      () => {
        alert("Unable to retrieve your location. Please allow location access.");
        setGpsLoading(false);
      }
    );
  };

  return (
    <div className="glass-card search-wrap">
      <form onSubmit={handleSubmit} className="search-inner">
        {/* Search field */}
        <div className="search-field">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="City name, zip code, or GPS coordinates…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* GPS button */}
        <button
          type="button"
          className={`btn btn-ghost ${gpsLoading ? "active" : ""}`}
          onClick={handleGPS}
          disabled={loading || gpsLoading}
          title="Use my current location"
        >
          {gpsLoading ? (
            <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              <circle cx="12" cy="12" r="8" strokeDasharray="4 2"/>
            </svg>
          )}
          My Location
        </button>

        {/* Search button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderTopColor: "#020d12" }} />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          )}
          Search
        </button>
      </form>
    </div>
  );
}