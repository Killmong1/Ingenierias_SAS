import { useState } from "react";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("simulation");

  // Estados de cada formulario
  const [uploadData, setUploadData] = useState({
    mission_id: "",
    timestamp: "",
    gps_lat: "",
    gps_lon: "",
    gps_alt: "",
    sensor_type: "",
    data_url: ""
  });
  const [uploadResult, setUploadResult] = useState("");

  const [missionId, setMissionId] = useState("");
  const [missionResult, setMissionResult] = useState("");

  const [queryFilters, setQueryFilters] = useState({
    start_date: "",
    end_date: "",
    sensor_type: ""
  });
  const [queryResult, setQueryResult] = useState("");

  const [simCount, setSimCount] = useState(5);
  const [simResult, setSimResult] = useState("");

  // Obtener token del localStorage
  const getToken = () => localStorage.getItem("token");

  // Headers con autenticación
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  });

  // Navegar entre secciones
  const showSection = (sec) => setActiveSection(sec);

  // ============================================
  // 1. SIMULACIÓN → POST /api/v1/simulate/{num}
  // El backend recibe {num} y genera ese número de misiones aleatorias
  // ============================================
  const simulateFlights = async () => {
    // Validar que simCount sea un número válido
    const count = parseInt(simCount);
    
    if (!count || count < 1 || count > 100) {
      setSimResult("❌ Por favor ingresa un número entre 1 y 100");
      return;
    }

    setSimResult("⏳ Generando simulación...");

    try {
      const res = await fetch(`http://localhost:8000/api/v1/simulate/${count}`, {
        method: "POST",
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        const error = await res.json();
        setSimResult("❌ Error del servidor:\n\n" + JSON.stringify(error, null, 2));
        return;
      }

      const data = await res.json();
      setSimResult(
        `✅ ¡Simulación exitosa!\n\n` +
        `📊 Misiones generadas: ${data.missions_generated}\n` +
        `🕐 Timestamp: ${data.timestamp}\n` +
        `🆔 ID Simulación: ${data.id}\n\n` +
        `📋 Misiones creadas:\n` +
        JSON.stringify(data.missions, null, 2)
      );
    } catch (err) {
      setSimResult("❌ Error de conexión con el servidor:\n" + err.message);
    }
  };

  // ============================================
  // 2. UPLOAD DATA → POST /api/v1/data/upload
  // ============================================
  const submitUpload = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/data/upload", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          mission_id: uploadData.mission_id,
          timestamp: uploadData.timestamp,
          gps_lat: parseFloat(uploadData.gps_lat),
          gps_lon: parseFloat(uploadData.gps_lon),
          gps_alt: uploadData.gps_alt ? parseFloat(uploadData.gps_alt) : null,
          sensor_type: uploadData.sensor_type,
          data_url: uploadData.data_url || null
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setUploadResult("❌ Error: " + JSON.stringify(error, null, 2));
        return;
      }

      const data = await res.json();
      setUploadResult("✅ Datos subidos!\n\n" + JSON.stringify(data, null, 2));
    } catch (err) {
      setUploadResult("❌ Error: " + err.message);
    }
  };

  // ============================================
  // 3. MISSION STATUS → GET /api/v1/missions/{mission_id}/status
  // ============================================
  const fetchMissionStatus = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/missions/${missionId}/status`,
        {
          method: "GET",
          headers: getAuthHeaders()
        }
      );

      if (!res.ok) {
        const error = await res.json();
        setMissionResult("❌ Error: " + JSON.stringify(error, null, 2));
        return;
      }

      const data = await res.json();
      setMissionResult("✅ Misión encontrada!\n\n" + JSON.stringify(data, null, 2));
    } catch (err) {
      setMissionResult("❌ Error: " + err.message);
    }
  };

  // ============================================
  // 4. DATA QUERY → GET /api/v1/data/query?start_date=...&sensor_type=...&lat=...&lon=...
  // Busca datos subidos manualmente con filtros independientes
  // ============================================
  const queryData = async () => {
    setQueryResult("⏳ Buscando datos...");

    try {
      const params = new URLSearchParams();
      
      // Solo agregar params que tengan valor
      if (queryFilters.start_date) params.append("start_date", queryFilters.start_date);
      if (queryFilters.end_date) params.append("end_date", queryFilters.end_date);
      if (queryFilters.type) params.append("type", queryFilters.type);  // ✔ CORREGIDO
      if (queryFilters.lat) params.append("lat", queryFilters.lat);
      if (queryFilters.lon) params.append("lon", queryFilters.lon);

      const url = `http://localhost:8000/api/v1/data/query${params.toString() ? '?' + params.toString() : ''}`;

      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        const error = await res.json();
        setQueryResult("❌ Error del servidor:\n\n" + JSON.stringify(error, null, 2));
        return;
      }

      const data = await res.json();
      
      if (data.total_found === 0) {
        setQueryResult(
          `🔍 No se encontraron datos con estos filtros.\n\n` +
          `Filtros aplicados:\n${JSON.stringify(data.filters_applied, null, 2)}\n\n` +
          `💡 Intenta subir algunos datos primero en la sección "Upload Data"`
        );
      } else {
        setQueryResult(
          `✅ Se encontraron ${data.total_found} registros\n\n` +
          `📋 Filtros aplicados:\n${JSON.stringify(data.filters_applied, null, 2)}\n\n` +
          `🎯 Resultados:\n${JSON.stringify(data.results, null, 2)}`
        );
      }
    } catch (err) {
      setQueryResult("❌ Error de conexión:\n" + err.message);
    }
};

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>
      {/* HEADER */}
      <header style={{
        background: "#0d6efd",
        padding: "15px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>🚁 Drone API Interface</h2>
        <nav>
          <button onClick={() => showSection("simulation")} style={btnNav}>Simulation</button>
          <button onClick={() => showSection("mission")} style={btnNav}>Mission Status</button>
          <button onClick={() => showSection("query")} style={btnNav}>Data Query</button>
          <button onClick={() => showSection("upload")} style={btnNav}>Upload Data</button>
        </nav>
      </header>

      {/* CONTENIDO */}
      <div style={{ padding: "25px" }}>

        {/* SIMULATION - PRIMERO PARA GENERAR DATOS */}
        {activeSection === "simulation" && (
          <section style={section}>
            <h3>🎮 Simular Vuelos</h3>
            <p style={{ color: "#666", marginBottom: "15px" }}>
              Genera misiones de prueba aleatorias para luego consultarlas en las otras secciones.
              El backend creará misiones con tipos, estados y progreso aleatorios.
            </p>

            <label>Cantidad de misiones a simular (1-100)</label>
            <input
              type="number"
              placeholder="Ingresa un número (ej: 5, 10, 20...)"
              min="1"
              max="100"
              value={simCount}
              onChange={(e) => setSimCount(e.target.value)}
              style={inputStyle}
            />

            <button style={btn} onClick={simulateFlights}>
              🚀 Generar {simCount || '?'} Misiones Aleatorias
            </button>

            {simResult && <div style={resultBox}>{simResult}</div>}
          </section>
        )}

        {/* MISSION STATUS */}
        {activeSection === "mission" && (
          <section style={section}>
            <h3>📊 Consultar Estado de Misión</h3>
            <p style={{ color: "#666", marginBottom: "15px" }}>
              Ingresa el ID de una misión (ej: M1001, M1002, etc.)
            </p>

            <label>ID de la misión</label>
            <input
              type="text"
              placeholder="M1001"
              value={missionId}
              onChange={(e) => setMissionId(e.target.value)}
              style={inputStyle}
            />

            <button style={btn} onClick={fetchMissionStatus}>🔍 Consultar</button>

            {missionResult && <div style={resultBox}>{missionResult}</div>}
          </section>
        )}

        {/* DATA QUERY */}
        {activeSection === "query" && (
          <section style={section}>
            <h3>🔎 Buscar Datos por Filtros</h3>
            <p style={{ color: "#666", marginBottom: "15px" }}>
            Busca datos subidos manualmente. Puedes usar uno o varios filtros de manera independiente.
            </p>

    <label>📅 Fecha Inicio (opcional)</label>
    <input
      type="date"
      value={queryFilters.start_date}
      onChange={(e) => setQueryFilters({ ...queryFilters, start_date: e.target.value })}
      style={inputStyle}
    />

    <label>📅 Fecha Fin (opcional)</label>
    <input
      type="date"
      value={queryFilters.end_date}
      onChange={(e) => setQueryFilters({ ...queryFilters, end_date: e.target.value })}
      style={inputStyle}
    />

    <label>📡 Tipo de Sensor (opcional)</label>
    <select
      value={queryFilters.type}
      onChange={(e) => setQueryFilters({ ...queryFilters, type: e.target.value })}
      style={inputStyle}
    >
      <option value="">Todos los sensores</option>
      <option value="RGB">RGB</option>
      <option value="Thermal">Thermal</option>
      <option value="Inspection">Inspection</option>
      <option value="Surveillance">Surveillance</option>
    </select>

    <label>🌍 Latitud GPS (opcional)</label>
    <input
      type="number"
      step="0.000001"
      placeholder="Ej: 4.1533"
      value={queryFilters.lat}
      onChange={(e) => setQueryFilters({ ...queryFilters, lat: e.target.value })}
      style={inputStyle}
    />

    <label>🌍 Longitud GPS (opcional)</label>
    <input
      type="number"
      step="0.000001"
      placeholder="Ej: -73.6345"
      value={queryFilters.lon}
      onChange={(e) => setQueryFilters({ ...queryFilters, lon: e.target.value })}
      style={inputStyle}
    />

    <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
      <button style={btn} onClick={queryData}>🔎 Buscar Datos</button>
      <button 
        style={{...btn, background: "#6c757d"}} 
        onClick={() => {
          setQueryFilters({
            start_date: "",
            end_date: "",
            type: "",
            lat: "",
            lon: ""
          });
          setQueryResult("");
        }}
      >
        🔄 Limpiar Filtros
      </button>
    </div>

    {queryResult && <div style={resultBox}>{queryResult}</div>}
  </section>
)}


        {/* UPLOAD DATA */}
        {activeSection === "upload" && (
          <section style={section}>
            <h3>📤 Upload Data to API</h3>

            <label>Mission ID</label>
            <input
              type="text"
              placeholder="M1001"
              value={uploadData.mission_id}
              onChange={(e) => setUploadData({ ...uploadData, mission_id: e.target.value })}
              style={inputStyle}
            />

            <label>Timestamp (ISO 8601)</label>
            <input
              type="text"
              placeholder="2025-12-10T15:30:00Z"
              value={uploadData.timestamp}
              onChange={(e) => setUploadData({ ...uploadData, timestamp: e.target.value })}
              style={inputStyle}
            />

            <label>GPS Latitude</label>
            <input
              type="number"
              step="0.000001"
              placeholder="4.1533"
              value={uploadData.gps_lat}
              onChange={(e) => setUploadData({ ...uploadData, gps_lat: e.target.value })}
              style={inputStyle}
            />

            <label>GPS Longitude</label>
            <input
              type="number"
              step="0.000001"
              placeholder="-73.6345"
              value={uploadData.gps_lon}
              onChange={(e) => setUploadData({ ...uploadData, gps_lon: e.target.value })}
              style={inputStyle}
            />

            <label>GPS Altitude (opcional)</label>
            <input
              type="number"
              step="0.1"
              placeholder="450"
              value={uploadData.gps_alt}
              onChange={(e) => setUploadData({ ...uploadData, gps_alt: e.target.value })}
              style={inputStyle}
            />

            <label>Sensor Type</label>
            <select
              value={uploadData.sensor_type}
              onChange={(e) => setUploadData({ ...uploadData, sensor_type: e.target.value })}
              style={inputStyle}
            >
              <option value="">Seleccionar...</option>
              <option value="RGB">RGB</option>
              <option value="Thermal">Thermal</option>
              <option value="LiDAR">LiDAR</option>
              <option value="Multispectral">Multispectral</option>
            </select>

            <label>Data URL (opcional)</label>
            <input
              type="text"
              placeholder="https://storage.example.com/data/file.jpg"
              value={uploadData.data_url}
              onChange={(e) => setUploadData({ ...uploadData, data_url: e.target.value })}
              style={inputStyle}
            />

            <button style={btn} onClick={submitUpload}>📤 Enviar Datos</button>

            {uploadResult && <div style={resultBox}>{uploadResult}</div>}
          </section>
        )}

      </div>
    </div>
  );
}

// ESTILOS
const btnNav = {
  marginRight: "15px",
  padding: "10px 18px",
  border: "none",
  background: "white",
  color: "#0d6efd",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const section = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  marginTop: "20px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "15px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  fontSize: "14px",
};

const btn = {
  marginTop: "15px",
  padding: "12px 25px",
  background: "#0d6efd",
  color: "white",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};

const resultBox = {
  background: "#f0f6ff",
  padding: "15px",
  borderLeft: "4px solid #0d6efd",
  marginTop: "20px",
  borderRadius: "5px",
  whiteSpace: "pre-wrap",
  fontFamily: "monospace",
  fontSize: "12px",
  maxHeight: "400px",
  overflow: "auto",
};