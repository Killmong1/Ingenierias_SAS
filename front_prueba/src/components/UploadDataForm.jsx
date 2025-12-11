import { useState } from "react";
import { uploadData } from "../api/api";

export default function UploadDataForm() {
  const [form, setForm] = useState({
    mission_id: "",
    timestamp: "",
    gps_lat: "",
    gps_lon: "",
    sensor_type: "",
  });

  const [result, setResult] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    const payload = {
      mission_id: form.mission_id,
      timestamp: form.timestamp,
      gps_lat: parseFloat(form.gps_lat),
      gps_lon: parseFloat(form.gps_lon),
      sensor_type: form.sensor_type,
    };

    const res = await uploadData(payload);
    setResult(res);
  }

  return (
    <div className="section">
      <h3>Upload Data to API</h3>

      <label>Mission ID</label>
      <input 
        name="mission_id"
        value={form.mission_id}
        onChange={handleChange}
      />

      <label>Timestamp</label>
      <input 
        name="timestamp"
        value={form.timestamp}
        onChange={handleChange}
      />

      <label>GPS Latitude</label>
      <input 
        type="number"
        name="gps_lat"
        value={form.gps_lat}
        onChange={handleChange}
      />

      <label>GPS Longitude</label>
      <input 
        type="number"
        name="gps_lon"
        value={form.gps_lon}
        onChange={handleChange}
      />

      <label>Sensor Type</label>
      <input 
        name="sensor_type"
        value={form.sensor_type}
        onChange={handleChange}
      />

      <button className="btn" onClick={handleSubmit}>
        Enviar Datos
      </button>

      {result && (
        <pre className="result-box">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
