import { useState } from "react";
import { queryData } from "../api/api";

export default function QueryData() {
  const [result, setResult] = useState("");

  async function handleQuery() {
    const filters = {
      start_date: document.getElementById("start_date").value,
      end_date: document.getElementById("end_date").value,
      sensor_type: document.getElementById("sensor_filter").value,
    };

    const data = await queryData(filters);
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <div className="section">
      <h3>Buscar Datos por Filtros</h3>

      <input id="start_date" placeholder="YYYY-MM-DD" />
      <input id="end_date" placeholder="YYYY-MM-DD" />
      <input id="sensor_filter" placeholder="Sensor" />

      <button className="btn" onClick={handleQuery}>Buscar</button>

      <pre className="result-box">{result}</pre>
    </div>
  );
}
