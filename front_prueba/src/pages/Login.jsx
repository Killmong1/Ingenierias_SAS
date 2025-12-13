// src/pages/Login.jsx
import { useState } from "react";
import { login } from "../api/authService";
import { useNavigate } from "react-router-dom";

// ===== ESTILOS (reutilizados del dashboard) =====
const section = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  marginTop: "20px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  maxWidth: "400px",
  margin: "80px auto"
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
  width: "100%"
};

const btnNav = {
  marginTop: "10px",
  padding: "10px 18px",
  border: "none",
  background: "white",
  color: "#0d6efd",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%"
};
// ===============================================

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(form);
      const token = res.data.access_token;

      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Error al iniciar sesión");
    }
  };

  return (
    <div>
      <div style={section}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          🔐 Iniciar Sesión
        </h2>

        {error && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input
            name="email"
            type="email"
            placeholder="Correo"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label>Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button type="submit" style={btn}>
            Ingresar
          </button>
        </form>

        <button
          style={btnNav}
          onClick={() => navigate("/signup")}
        >
          Crear una cuenta
        </button>
      </div>
    </div>
  );
}
