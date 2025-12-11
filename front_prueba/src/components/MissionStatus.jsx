import { useState } from "react";
import { getMissionStatus } from "../api/api";

export default function MissionStatus() {
  const [result, setResult] = useState("");

  async function handleQuery() {
    const missionId = document.getElementById("mission_id").value;
    const data = await getMissionStatus(missionId);
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <div className="section">
      <h3>Consultar Estado de Misión</h3>

      <input id="mission_id" placeholder="M001" />
      <button className="btn" onClick={handleQuery}>Consultar</button>

      <pre className="result-box">{result}</pre>
    </div>
  );
}
