// src/pages/Signup.jsx
import { useState } from "react";
import { signup } from "../api/authService";
import { useNavigate } from "react-router-dom";

// ===== ESTILOS (reutilizados del dashboard) =====
const section = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  marginTop: "20px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  maxWidth: "450px",
  margin: "60px auto"
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

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await signup(form);

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrarse");
    }
  };

  return (
    <div>
      <div style={section}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          📝 Crear Cuenta
        </h2>

        {message && (
          <p style={{ color: "green", fontSize: "14px", marginBottom: "10px" }}>
            {message}
          </p>
        )}

        {error && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            name="first_name"
            placeholder="Nombre"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label>Apellido</label>
          <input
            name="last_name"
            placeholder="Apellido"
            onChange={handleChange}
            required
            style={inputStyle}
          />

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
            Registrarse
          </button>
        </form>

        <button
          style={btnNav}
          onClick={() => navigate("/login")}
        >
          Ya tengo cuenta
        </button>
      </div>
    </div>
  );
}
