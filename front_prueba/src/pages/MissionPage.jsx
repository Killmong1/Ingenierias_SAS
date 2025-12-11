// src/pages/MissionPage.jsx

import { useState } from "react";
import SimulationPanel from "../components/SimulationPanel";
import MissionStatus from "../components/MissionStatus";

export default function MissionPage() {
  const [missions, setMissions] = useState([]);

  const handleSimulate = (generatedMissions) => {
    setMissions(generatedMissions);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Simulación de Misiones</h1>

      {/* Panel que genera vuelos simulados */}
      <SimulationPanel onSimulate={handleSimulate} />

      {/* Lista de misiones generadas */}
      <MissionStatus missions={missions} />
    </div>
  );
}
