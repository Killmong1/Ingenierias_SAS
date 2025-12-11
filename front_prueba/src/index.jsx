<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Drone API Dashboard</title>

  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f4f4f4;
    }

    header {
      background: #0d6efd;
      padding: 15px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    nav button {
      margin-right: 15px;
      padding: 10px 18px;
      border: none;
      background: white;
      color: #0d6efd;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }

    nav button:hover {
      background: #dce8ff;
    }

    .container {
      padding: 25px;
    }

    .section {
      display: none; /* Se ocultan por defecto */
      background: white;
      padding: 25px;
      border-radius: 10px;
      margin-top: 20px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .section.active {
      display: block;
    }

    input, select {
      padding: 10px;
      margin-top: 10px;
      width: 100%;
      border-radius: 6px;
      border: 1px solid #bbb;
    }

    .btn {
      margin-top: 15px;
      padding: 12px;
      background: #0d6efd;
      color: white;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }

    .btn:hover {
      background: #084bc1;
    }

    .result-box {
      background: #f0f6ff;
      padding: 15px;
      border-left: 4px solid #0d6efd;
      margin-top: 20px;
      border-radius: 5px;
      white-space: pre-wrap;
    }
  </style>
</head>

<body>

<header>
  <h2>Drone API Interface</h2>

  <nav>
    <button onclick="showSection('upload')">Upload Data</button>
    <button onclick="showSection('mission')">Mission Status</button>
    <button onclick="showSection('query')">Data Query</button>
    <button onclick="showSection('simulation')">Simulation</button>
  </nav>
</header>

<div class="container">

  <!-- --------------------------------------------------------- -->
  <!-- SECTION: UPLOAD DATA -->
  <!-- --------------------------------------------------------- -->
  <div id="upload" class="section active">
    <h3>Upload Data to API</h3>
    <label>Mission ID</label>
    <input id="up_mission" type="text" placeholder="M001">

    <label>Timestamp</label>
    <input id="up_time" type="text" placeholder="2025-03-20T10:00:00Z">

    <label>GPS Latitude</label>
    <input id="up_lat" type="number" step="0.0001">

    <label>GPS Longitude</label>
    <input id="up_lon" type="number" step="0.0001">

    <label>Sensor Type</label>
    <input id="up_sensor" type="text" placeholder="RGB, Thermal, LiDAR">

    <button class="btn" onclick="submitUpload()">Enviar Datos</button>

    <div id="upload_result" class="result-box"></div>
  </div>


  <!-- --------------------------------------------------------- -->
  <!-- SECTION: MISSION STATUS -->
  <!-- --------------------------------------------------------- -->
  <div id="mission" class="section">
    <h3>Consultar Estado de Misión</h3>

    <label>ID de la misión</label>
    <input id="mission_id" type="text" placeholder="M001">

    <button class="btn" onclick="fetchMissionStatus()">Consultar</button>

    <div id="mission_result" class="result-box"></div>
  </div>


  <!-- --------------------------------------------------------- -->
  <!-- SECTION: DATA QUERY -->
  <!-- --------------------------------------------------------- -->
  <div id="query" class="section">
    <h3>Buscar Datos por Filtros</h3>

    <label>Fecha Inicio</label>
    <input id="start_date" type="text" placeholder="YYYY-MM-DD">

    <label>Fecha Fin</label>
    <input id="end_date" type="text" placeholder="YYYY-MM-DD">

    <label>Tipo de Sensor</label>
    <input id="sensor_filter" type="text">

    <button class="btn" onclick="queryData()">Buscar</button>

    <div id="query_result" class="result-box"></div>
  </div>


  <!-- --------------------------------------------------------- -->
  <!-- SECTION: SIMULATION -->
  <!-- --------------------------------------------------------- -->
  <div id="simulation" class="section">
    <h3>Simular Vuelos</h3>

    <label>Cantidad de vuelos a simular</label>
    <input id="sim_count" type="number" placeholder="100">

    <button class="btn" onclick="simulateFlights()">Simular</button>

    <div id="sim_result" class="result-box"></div>
  </div>

</div>

<script>
  function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  async function submitUpload() {
    const data = {
      mission_id: document.getElementById("up_mission").value,
      timestamp: document.getElementById("up_time").value,
      gps_lat: parseFloat(document.getElementById("up_lat").value),
      gps_lon: parseFloat(document.getElementById("up_lon").value),
      sensor_type: document.getElementById("up_sensor").value
    };

    const resp = await fetch("http://localhost:8000/api/v1/data/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    document.getElementById("upload_result").innerText = JSON.stringify(await resp.json(), null, 2);
  }

  async function fetchMissionStatus() {
    const missionId = document.getElementById("mission_id").value;

    const resp = await fetch(`http://localhost:8000/api/v1/missions/${missionId}/status`);
    document.getElementById("mission_result").innerText = JSON.stringify(await resp.json(), null, 2);
  }

  async function queryData() {
    const params = new URLSearchParams({
      start_date: document.getElementById("start_date").value,
      end_date: document.getElementById("end_date").value,
      sensor_type: document.getElementById("sensor_filter").value
    });

    const resp = await fetch("http://localhost:8000/api/v1/data/query?" + params.toString());
    document.getElementById("query_result").innerText = JSON.stringify(await resp.json(), null, 2);
  }

  function simulateFlights() {
    const count = parseInt(document.getElementById("sim_count").value);

    const flights = [];
    for (let i = 0; i < count; i++) {
      flights.push({
        id: "SIM" + i,
        lat: 4.6 + Math.random() * 0.03,
        lon: -74.1 + Math.random() * 0.03,
        sensor: ["RGB", "Thermal", "LiDAR"][Math.floor(Math.random()*3)]
      });
    }

    document.getElementById("sim_result").innerText =
      JSON.stringify(flights, null, 2);
  }
</script>

</body>
</html>
