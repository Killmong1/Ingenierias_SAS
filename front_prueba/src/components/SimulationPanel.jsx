import { useState } from "react";
import { simulateMissions } from "../api/api";

export default function Simulation() {
  const [result, setResult] = useState("");

  async function handleSim() {
    const n = document.getElementById("sim_count").value;
    const data = await simulateMissions(n);
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <div className="section">
      <h3>Simular Vuelos</h3>

      <input id="sim_count" type="number" placeholder="100" />

      <button className="btn" onClick={handleSim}>Simular</button>

      <pre className="result-box">{result}</pre>
    </div>
  );
}
