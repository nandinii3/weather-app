const mongoose = require("mongoose");

const WeatherRecordSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    resolvedLocation: {
      type: String, // The actual city name returned by the API
    },
    coordinates: {
      lat: Number,
      lon: Number,
    },
    dateRange: {
      from: { type: Date },
      to: { type: Date },
    },
    currentWeather: {
      temperature: Number,      // in Celsius
      feelsLike: Number,
      humidity: Number,
      windSpeed: Number,
      description: String,
      icon: String,
      pressure: Number,
      visibility: Number,
    },
    forecast: [
      {
        date: String,
        tempMin: Number,
        tempMax: Number,
        description: String,
        icon: String,
        humidity: Number,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("WeatherRecord", WeatherRecordSchema);