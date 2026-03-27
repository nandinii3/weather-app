const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const weatherRoutes = require("./routes/weather");
const exportRoutes = require("./routes/export");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/weather", weatherRoutes);
app.use("/api/export", exportRoutes);

// Health check
app.get("/", (req, res) => res.send("Weather App Backend Running ✅"));

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));