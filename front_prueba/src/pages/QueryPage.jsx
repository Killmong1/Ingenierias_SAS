import { useState } from "react";

export default function QueryPage() {
  const [sensor, setSensor] = useState("");
  const [results, setResults] = useState([]);

  const query = async () => {
    const url = new URL("http://localhost:8000/api/v1/data/query");
    if (sensor) url.searchParams.append("sensor_type", sensor);

    const res = await fetch(url);
    const data = await res.json();
    setResults(data.results || []);
  };

  return (
    <div>
      <h2>Buscar Datos de Misiones</h2>

      <input
        type="text"
        placeholder="Tipo de sensor (ej: RGB)"
        value={sensor}
        onChange={(e) => setSensor(e.target.value)}
      />
      <button onClick={query}>Buscar</button>

      <ul>
        {results.map((r, i) => (
          <li key={i}>
            {r.mission_id} — {r.sensor_type} — {r.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}
