import React, { useState } from "react";

const API = "http://localhost:5000/api";

export default function History({ records, onRefresh }) {
  const [editRecord, setEditRecord] = useState(null);
  const [editNotes, setEditNotes] = useState("");
  const [editFrom, setEditFrom] = useState("");
  const [editTo, setEditTo] = useState("");
  const [saving, setSaving] = useState(false);

  const openEdit = (rec) => {
    setEditRecord(rec);
    setEditNotes(rec.notes || "");
    setEditFrom(rec.dateRange?.from ? rec.dateRange.from.split("T")[0] : "");
    setEditTo(rec.dateRange?.to ? rec.dateRange.to.split("T")[0] : "");
  };

  const closeEdit = () => setEditRecord(null);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/weather/${editRecord._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: editNotes,
          dateFrom: editFrom || undefined,
          dateTo: editTo || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onRefresh();
      closeEdit();
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await fetch(`${API}/weather/${id}`, { method: "DELETE" });
      onRefresh();
    } catch {
      alert("Delete failed.");
    }
  };

  const handleExport = (format) => {
    window.open(`${API}/export/${format}`, "_blank");
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <>
      <div className="glass-card history-card">
        <div className="history-header">
          <div className="section-title" style={{ marginBottom: 0 }}>Saved Searches</div>
          <div className="history-actions">
            <span className="export-label">Export:</span>
            {["json", "csv", "pdf", "markdown"].map((fmt) => (
              <button key={fmt} className="btn btn-ghost btn-sm" onClick={() => handleExport(fmt)}>
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {records.length === 0 ? (
          <div className="no-records">
            No saved records yet. Search for a location and click Save.
          </div>
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Temperature</th>
                  <th>Condition</th>
                  <th>Humidity</th>
                  <th>Wind</th>
                  <th>Saved</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id}>
                    <td className="location-cell">{rec.resolvedLocation || rec.location}</td>
                    <td>
                      <span className="temp-pill">
                        {Math.round(rec.currentWeather?.temperature ?? 0)}°C
                      </span>
                    </td>
                    <td className="condition-text">{rec.currentWeather?.description || "—"}</td>
                    <td>{rec.currentWeather?.humidity ?? "—"}%</td>
                    <td>{rec.currentWeather?.windSpeed ?? "—"} m/s</td>
                    <td style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                      {formatDate(rec.createdAt)}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(rec)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rec._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editRecord && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Record — {editRecord.resolvedLocation || editRecord.location}</h3>

            <div className="form-group">
              <label className="form-label">Date From</label>
              <input
                type="date"
                className="form-input"
                value={editFrom}
                onChange={(e) => setEditFrom(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date To</label>
              <input
                type="date"
                className="form-input"
                value={editTo}
                onChange={(e) => setEditTo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                rows={3}
                style={{ resize: "vertical" }}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add personal notes about this location..."
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeEdit}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}