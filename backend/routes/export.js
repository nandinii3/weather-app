const express = require("express");
const router = express.Router();
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const WeatherRecord = require("../models/WeatherRecord");

// ─────────────────────────────────────────────
// EXPORT JSON — GET /api/export/json
// ─────────────────────────────────────────────
router.get("/json", async (req, res) => {
  try {
    const records = await WeatherRecord.find().lean();
    res.setHeader("Content-Disposition", "attachment; filename=weather_records.json");
    res.setHeader("Content-Type", "application/json");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Export failed." });
  }
});

// ─────────────────────────────────────────────
// EXPORT CSV — GET /api/export/csv
// ─────────────────────────────────────────────
router.get("/csv", async (req, res) => {
  try {
    const records = await WeatherRecord.find().lean();

    const flat = records.map((r) => ({
      id: r._id,
      location: r.location,
      resolvedLocation: r.resolvedLocation,
      lat: r.coordinates?.lat,
      lon: r.coordinates?.lon,
      temperature: r.currentWeather?.temperature,
      feelsLike: r.currentWeather?.feelsLike,
      humidity: r.currentWeather?.humidity,
      windSpeed: r.currentWeather?.windSpeed,
      description: r.currentWeather?.description,
      pressure: r.currentWeather?.pressure,
      dateFrom: r.dateRange?.from,
      dateTo: r.dateRange?.to,
      notes: r.notes,
      createdAt: r.createdAt,
    }));

    const parser = new Parser();
    const csv = parser.parse(flat);

    res.setHeader("Content-Disposition", "attachment; filename=weather_records.csv");
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "CSV export failed." });
  }
});

// ─────────────────────────────────────────────
// EXPORT PDF — GET /api/export/pdf
// ─────────────────────────────────────────────
router.get("/pdf", async (req, res) => {
  try {
    const records = await WeatherRecord.find().lean();

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Disposition", "attachment; filename=weather_records.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(20).text("Weather App — Saved Records", { align: "center" });
    doc.moveDown();

    records.forEach((r, i) => {
      doc.fontSize(14).text(`${i + 1}. ${r.resolvedLocation || r.location}`, { underline: true });
      doc.fontSize(11)
        .text(`Temperature: ${r.currentWeather?.temperature}°C  |  Feels Like: ${r.currentWeather?.feelsLike}°C`)
        .text(`Humidity: ${r.currentWeather?.humidity}%  |  Wind: ${r.currentWeather?.windSpeed} m/s`)
        .text(`Condition: ${r.currentWeather?.description}`)
        .text(`Coordinates: ${r.coordinates?.lat}, ${r.coordinates?.lon}`)
        .text(`Date Range: ${r.dateRange?.from ? new Date(r.dateRange.from).toDateString() : "N/A"} → ${r.dateRange?.to ? new Date(r.dateRange.to).toDateString() : "N/A"}`)
        .text(`Notes: ${r.notes || "—"}`)
        .text(`Saved at: ${new Date(r.createdAt).toLocaleString()}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "PDF export failed." });
  }
});

// ─────────────────────────────────────────────
// EXPORT MARKDOWN — GET /api/export/markdown
// ─────────────────────────────────────────────
router.get("/markdown", async (req, res) => {
  try {
    const records = await WeatherRecord.find().lean();

    let md = `# Weather App Records\n\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n`;

    records.forEach((r, i) => {
      md += `## ${i + 1}. ${r.resolvedLocation || r.location}\n\n`;
      md += `| Field | Value |\n|---|---|\n`;
      md += `| Temperature | ${r.currentWeather?.temperature}°C |\n`;
      md += `| Feels Like | ${r.currentWeather?.feelsLike}°C |\n`;
      md += `| Humidity | ${r.currentWeather?.humidity}% |\n`;
      md += `| Wind Speed | ${r.currentWeather?.windSpeed} m/s |\n`;
      md += `| Condition | ${r.currentWeather?.description} |\n`;
      md += `| Coordinates | ${r.coordinates?.lat}, ${r.coordinates?.lon} |\n`;
      md += `| Date From | ${r.dateRange?.from ? new Date(r.dateRange.from).toDateString() : "N/A"} |\n`;
      md += `| Date To | ${r.dateRange?.to ? new Date(r.dateRange.to).toDateString() : "N/A"} |\n`;
      md += `| Notes | ${r.notes || "—"} |\n`;
      md += `| Saved At | ${new Date(r.createdAt).toLocaleString()} |\n\n---\n\n`;
    });

    res.setHeader("Content-Disposition", "attachment; filename=weather_records.md");
    res.setHeader("Content-Type", "text/markdown");
    res.send(md);
  } catch (err) {
    res.status(500).json({ error: "Markdown export failed." });
  }
});

module.exports = router;