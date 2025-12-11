import { useState } from "react";

export default function UploadPage() {
  const [form, setForm] = useState({
    mission_id: "",
    timestamp: "",
    gps_lat: "",
    gps_lon: "",
    sensor_type: "",
    data_url: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const upload = async () => {
    const res = await fetch("http://localhost:8000/api/v1/data/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    alert("Datos enviados correctamente");
  };

  return (
    <div>
      <h2>Subir Datos de Misión</h2>

      <input name="mission_id" placeholder="ID misión" onChange={handleChange} />
      <input name="timestamp" placeholder="timestamp" onChange={handleChange} />
      <input name="gps_lat" placeholder="latitud" onChange={handleChange} />
      <input name="gps_lon" placeholder="longitud" onChange={handleChange} />
      <input name="sensor_type" placeholder="sensor" onChange={handleChange} />
      <input name="data_url" placeholder="URL datos" onChange={handleChange} />

      <button onClick={upload}>Enviar</button>
    </div>
  );
}
