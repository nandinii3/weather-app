# Atmos — Full Stack Weather Application
### PM Accelerator Technical Assessment | Built by Nandini Shrivas

---

## Overview

Atmos is a full-stack weather application built as part of the PM Accelerator AI Engineer Intern Technical Assessment. It combines a React frontend with a Node.js/Express backend and MongoDB database to deliver real-time weather data with full CRUD functionality, data export, and third-party API integrations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (NoSQL) |
| Weather Data | OpenWeatherMap API |
| Maps Integration | Google Maps Embed API |
| Styling | Custom CSS (Glassmorphism) |

---

## Features

### Assessment 1 — Frontend
- Search weather by city name, zip code, or GPS coordinates
- Real-time current weather display (temperature, humidity, wind speed, pressure, visibility)
- Animated weather icons from OpenWeatherMap
- 5-day forecast with daily high/low temperatures and humidity
- GPS geolocation — "My Location" button auto-detects user location
- Dark mode and light mode toggle
- Error handling for invalid locations and failed API requests
- Fully responsive design (desktop, tablet, mobile)
- Glassmorphism UI with blue/cyan accent colors

### Assessment 2 — Backend
- **CREATE** — Save weather searches with optional date range and input validation
- **READ** — View all previously saved weather records in a history table
- **UPDATE** — Edit notes and date ranges on saved records with validation
- **DELETE** — Remove records with confirmation prompt
- **Export** — Download saved data in JSON, CSV, PDF, or Markdown format
- YouTube API — fetches location travel videos
- Google Maps Embed — displays location on an interactive map
- Input validation for dates and location existence

---

## Project Structure

```
weather-app/
├── backend/
│   ├── .env                 
│   ├── .env.example         
│   ├── server.js             
│   ├── package.json
│   ├── models/
│   │   └── WeatherRecord.js 
│   └── routes/
│       ├── weather.js       
│       └── export.js        
└── frontend/
    └── src/
        ├── App.js
        ├── App.css
        ├── index.js
        └── components/
            ├── Header.js
            ├── SearchBar.js
            ├── CurrentWeather.js
            ├── Forecast.js
            ├── History.js
            └── PMAccelerator.js
```

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier)
- OpenWeatherMap API key (free)
- Google Maps Embed API key (free via Google Cloud)

---

### 1. Clone the Repository

```bash
git clone https://github.com/nandinii3/weather-app.git
cd weather-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
OPENWEATHER_API_KEY=your_openweathermap_api_key
YOUTUBE_API_KEY=your_youtube_data_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_embed_api_key
```

Start the backend:

```bash
node server.js
```

Expected output:
```
✅ MongoDB Connected
✅ Server running on port 5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

App opens at **http://localhost:3000**

---

## API Endpoints

### Weather Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/weather` | Save a new weather record (CREATE) |
| `GET` | `/api/weather` | Get all saved records (READ ALL) |
| `GET` | `/api/weather/live/:location` | Live weather lookup (no save) |
| `GET` | `/api/weather/:id` | Get single record by ID |
| `PUT` | `/api/weather/:id` | Update record notes/dates (UPDATE) |
| `DELETE` | `/api/weather/:id` | Delete a record (DELETE) |
| `GET` | `/api/weather/youtube/:location` | YouTube videos for location |
| `GET` | `/api/weather/maps/:location` | Google Maps embed URL |

### Export Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/export/json` | Export all records as JSON |
| `GET` | `/api/export/csv` | Export all records as CSV |
| `GET` | `/api/export/pdf` | Export all records as PDF |
| `GET` | `/api/export/markdown` | Export all records as Markdown |

---

## Environment Variables

| Variable | Description | Where to get it |
|---|---|---|
| `PORT` | Backend port (default 5000) | Set to 5000 |
| `MONGODB_URI` | MongoDB Atlas connection string | mongodb.com/atlas |
| `OPENWEATHER_API_KEY` | Weather API key | openweathermap.org/api |
| `GOOGLE_MAPS_API_KEY` | Maps Embed API | console.cloud.google.com |

---

## Error Handling

- Invalid city names return a clear user-facing error message
- Failed API requests display an error banner without crashing
- Date range validation prevents start date from being after end date
- GPS geolocation gracefully falls back with an alert if permission denied
- MongoDB connection errors are logged in the backend terminal

---

## Responsive Design

- **Desktop** (980px+) — Full layout with all columns
- **Tablet** (680px) — Weather stats collapse to 2 columns
- **Mobile** (420px) — Search bar stacks, forecast adjusts to 2 columns

---

## About PM Accelerator

The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. From students looking for entry-level jobs to Directors looking to take on a leadership role, the program has helped hundreds of students fulfill their career aspirations.

- **Website:** https://www.pmaccelerator.io/
- **Phone:** +1 (954) 889-1063
- **Industry:** E-Learning Providers
- **Founded:** 2020

---

## Author

**Nandini Shrivas**
Built as part of the PM Accelerator AI Engineer Intern Technical Assessment.
