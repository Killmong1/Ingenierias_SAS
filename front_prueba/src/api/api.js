const API_URL = "http://127.0.0.1:8000/api/v1";

// --- 1. Simular misiones ---
export async function simulateMissions(n) {
  const res = await fetch(`${API_URL}/simulate/${n}`, {
    method: "POST",
  });
  return res.json();
}

// --- 2. Buscar misión por ID ---
export async function getMissionStatus(id) {
  const res = await fetch(`${API_URL}/missions/${id}/status`);
  return res.json();
}

// --- 3. Filtrar datos ---
export async function queryData(filters) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_URL}/data/query?${params.toString()}`);
  return res.json();
}

// --- 4. Subir datos ---
export async function uploadData(payload) {
  const res = await fetch(`${API_URL}/data/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
