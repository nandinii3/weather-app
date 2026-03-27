const express = require("express");
const router = express.Router();
const axios = require("axios");
const WeatherRecord = require("../models/WeatherRecord");

const OW_KEY = process.env.OPENWEATHER_API_KEY;
const YT_KEY = process.env.YOUTUBE_API_KEY;
const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ─────────────────────────────────────────────
// HELPER: Fetch weather data from OpenWeatherMap
// ─────────────────────────────────────────────
async function fetchWeatherData(location) {
  // Try searching by city name / zip — OpenWeatherMap handles both
  const currentRes = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: {
        q: location,
        appid: OW_KEY,
        units: "metric",
      },
    }
  );

  const { lat, lon } = currentRes.data.coord;

  // 5-day forecast (every 3 hours — we'll pick one entry per day)
  const forecastRes = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast`,
    {
      params: { lat, lon, appid: OW_KEY, units: "metric" },
    }
  );

  // Pick one forecast entry per unique date (noon reading)
  const dailyMap = {};
  forecastRes.data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
      };
    } else {
      // Keep the lowest min and highest max
      dailyMap[date].tempMin = Math.min(dailyMap[date].tempMin, item.main.temp_min);
      dailyMap[date].tempMax = Math.max(dailyMap[date].tempMax, item.main.temp_max);
    }
  });

  const forecast = Object.values(dailyMap).slice(0, 5);

  const current = currentRes.data;
  return {
    resolvedLocation: `${current.name}, ${current.sys.country}`,
    coordinates: { lat, lon },
    currentWeather: {
      temperature: current.main.temp,
      feelsLike: current.main.feels_like,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      pressure: current.main.pressure,
      visibility: current.visibility,
    },
    forecast,
  };
}

// ─────────────────────────────────────────────
// CREATE — POST /api/weather
// Save a new weather search with optional date range
// ─────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { location, dateFrom, dateTo, notes } = req.body;

    if (!location) {
      return res.status(400).json({ error: "Location is required." });
    }

    // Validate date range if provided
    if (dateFrom && dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      if (isNaN(from) || isNaN(to)) {
        return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
      }
      if (from > to) {
        return res.status(400).json({ error: "Start date must be before end date." });
      }
    }

    // Fetch real weather data
    let weatherData;
    try {
      weatherData = await fetchWeatherData(location);
    } catch (err) {
      if (err.response?.status === 404) {
        return res.status(404).json({ error: `Location "${location}" not found. Please try a different name.` });
      }
      throw err;
    }

    // Save to DB
    const record = new WeatherRecord({
      location,
      ...weatherData,
      dateRange: {
        from: dateFrom ? new Date(dateFrom) : null,
        to: dateTo ? new Date(dateTo) : null,
      },
      notes: notes || "",
    });

    await record.save();
    res.status(201).json({ message: "Weather record saved.", record });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────────
// READ ALL — GET /api/weather
// Get all saved weather records
// ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const records = await WeatherRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch records." });
  }
});

// ─────────────────────────────────────────────
// READ ONE — GET /api/weather/:id
// ─────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const record = await WeatherRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found." });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch record." });
  }
});

// ─────────────────────────────────────────────
// LIVE WEATHER (no save) — GET /api/weather/live/:location
// Used by frontend for quick lookups
// ─────────────────────────────────────────────
router.get("/live/:location", async (req, res) => {
  try {
    const data = await fetchWeatherData(req.params.location);
    res.json(data);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: `Location "${req.params.location}" not found.` });
    }
    res.status(500).json({ error: "Could not fetch weather." });
  }
});

// ─────────────────────────────────────────────
// UPDATE — PUT /api/weather/:id
// Update notes or date range of a saved record
// ─────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const { notes, dateFrom, dateTo } = req.body;

    const updateFields = {};
    if (notes !== undefined) updateFields.notes = notes;

    if (dateFrom && dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      if (isNaN(from) || isNaN(to)) {
        return res.status(400).json({ error: "Invalid date format." });
      }
      if (from > to) {
        return res.status(400).json({ error: "Start date must be before end date." });
      }
      updateFields.dateRange = { from, to };
    }

    const updated = await WeatherRecord.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Record not found." });
    res.json({ message: "Record updated.", record: updated });
  } catch (err) {
    res.status(500).json({ error: "Could not update record." });
  }
});

// ─────────────────────────────────────────────
// DELETE — DELETE /api/weather/:id
// ─────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await WeatherRecord.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record not found." });
    res.json({ message: "Record deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Could not delete record." });
  }
});

// ─────────────────────────────────────────────
// YOUTUBE — GET /api/weather/youtube/:location
// ─────────────────────────────────────────────
router.get("/youtube/:location", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          q: `${req.params.location} travel guide`,
          part: "snippet",
          maxResults: 3,
          type: "video",
          key: YT_KEY,
        },
      }
    );
    const videos = response.data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle,
    }));
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch YouTube videos." });
  }
});

// ─────────────────────────────────────────────
// GOOGLE MAPS EMBED URL — GET /api/weather/maps/:location
// ─────────────────────────────────────────────
router.get("/maps/:location", async (req, res) => {
  try {
    const encodedLocation = encodeURIComponent(req.params.location);
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodedLocation}`;
    res.json({ embedUrl });
  } catch (err) {
    res.status(500).json({ error: "Could not generate map URL." });
  }
});

module.exports = router;