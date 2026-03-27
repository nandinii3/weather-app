import React from "react";

export default function CurrentWeather({ data, onSave }) {
  const { resolvedLocation, currentWeather, coordinates } = data;
  const { temperature, feelsLike, humidity, windSpeed, description, icon, pressure, visibility } = currentWeather;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const formatVisibility = (v) => {
    if (!v) return "—";
    return v >= 1000 ? `${(v / 1000).toFixed(1)} km` : `${v} m`;
  };

  return (
    <div className="glass-card weather-card">
      <div className="weather-top">
        <div>
          <div className="weather-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {resolvedLocation}
          </div>
          <div className="weather-temp">
            {Math.round(temperature)}<sup>°C</sup>
          </div>
          <div className="weather-desc">{description}</div>
          {coordinates && (
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 6 }}>
              {coordinates.lat.toFixed(4)}° N, {coordinates.lon.toFixed(4)}° E
            </div>
          )}
        </div>

        <div className="weather-icon-wrap">
          <img src={iconUrl} alt={description} />
          <button className="btn btn-ghost btn-sm" onClick={onSave}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save
          </button>
        </div>
      </div>

      <div className="weather-stats">
        <div className="stat-item">
          <div className="stat-label">Feels Like</div>
          <div className="stat-value">{Math.round(feelsLike)}<span className="stat-unit">°C</span></div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Humidity</div>
          <div className="stat-value">{humidity}<span className="stat-unit">%</span></div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Wind</div>
          <div className="stat-value">{windSpeed}<span className="stat-unit">m/s</span></div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Pressure</div>
          <div className="stat-value">{pressure}<span className="stat-unit">hPa</span></div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Visibility</div>
          <div className="stat-value" style={{ fontSize: 16 }}>{formatVisibility(visibility)}</div>
        </div>
      </div>
    </div>
  );
}