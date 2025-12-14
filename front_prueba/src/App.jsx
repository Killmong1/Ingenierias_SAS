// src/App.jsx
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Páginas de usuario
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

// Componentes anteriores
import UploadData from "./components/UploadDataForm";
import MissionStatus from "./components/MissionStatus";
import QueryData from "./components/QueryData";
import Simulation from "./components/SimulationPanel";

// Página con pestañas internas
import MissionPage from "./pages/MissionPage";
import UploadPage from "./pages/UploadPage";
import QueryPage from "./pages/QueryPage";

export default function App() {
  // 🔥 useEffect DENTRO de la función App
  useEffect(() => {
    // Despertar el servidor al cargar la app
    fetch('https://prueba-tech-125.onrender.com/docs')
      .then(() => console.log('✅ Servidor despierto'))
      .catch(() => console.log('⏳ Despertando servidor...'));

    // Mantener vivo cada 5 minutos
    const keepAlive = setInterval(() => {
      fetch('https://prueba-tech-125.onrender.com/docs')
        .catch(() => {});
    }, 5 * 60 * 1000);

    return () => clearInterval(keepAlive);
  }, []);

  return (
    <HashRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/missions" element={<MissionPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/query" element={<QueryPage />} />

        {/* Rutas originales */}
        <Route path="/upload-data" element={<UploadData />} />
        <Route path="/mission-status" element={<MissionStatus />} />
        <Route path="/data-query" element={<QueryData />} />
        <Route path="/simulation" element={<Simulation />} />
      </Routes>
    </HashRouter>
  );
}