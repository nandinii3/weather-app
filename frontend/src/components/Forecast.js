import React from "react";

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function Forecast({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="glass-card forecast-card">
      <div className="section-title">5-Day Forecast</div>
      <div className="forecast-grid">
        {forecast.map((day, i) => {
          const date = new Date(day.date);
          const dayName = i === 0 ? "Today" : DAY_NAMES[date.getDay()];
          const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;

          return (
            <div className="forecast-day" key={day.date}>
              <div className="forecast-date">{dayName}</div>
              <img
                src={iconUrl}
                alt={day.description}
                className="forecast-icon"
              />
              <div className="forecast-high">{Math.round(day.tempMax)}°</div>
              <div className="forecast-low">{Math.round(day.tempMin)}°</div>
              <div className="forecast-rain">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                {day.humidity}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}