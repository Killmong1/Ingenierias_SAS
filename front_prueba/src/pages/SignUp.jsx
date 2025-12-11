// src/pages/Signup.jsx
import { useState } from "react";
import { signup } from "../api/authService";
import { useNavigate } from "react-router-dom";

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

      setMessage(res.data.message); // "User registered successfully"

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrarse");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Crear Cuenta</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="Nombre" onChange={handleChange} required /><br /><br />
        <input name="last_name" placeholder="Apellido" onChange={handleChange} required /><br /><br />
        <input name="email" type="email" placeholder="Correo" onChange={handleChange} required /><br /><br />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required /><br /><br />

        <button type="submit">Registrarse</button>
      </form>

      <br />

      <button onClick={() => navigate("/login")}>
        Ya tengo cuenta
      </button>
    </div>
  );
}
