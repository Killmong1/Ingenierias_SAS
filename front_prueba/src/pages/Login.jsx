// src/pages/Login.jsx
import { useState } from "react";
import { login } from "../api/authService";
import { useNavigate } from "react-router-dom";

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

      navigate("/dashboard"); // REDIRECCIÓN CORRECTA
    } catch (err) {
      setError(err.response?.data?.detail || "Error al iniciar sesión");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Iniciar Sesión</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Correo" onChange={handleChange} required /><br /><br />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required /><br /><br />

        <button type="submit">Ingresar</button>
      </form>

      <br />

      <button onClick={() => navigate("/signup")}>
        Crear una cuenta
      </button>
    </div>
  );
}
