// src/api/authService.js
import axios from "axios";

const API_URL = "https://prueba-tech-125.onrender.com/api/v1/auth";

// Crear instancia con timeout largo para el cold start
const api = axios.create({
  timeout: 60000, // 60 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

export const signup = async (data) => {
  return axios.post(`${API_URL}/signup`, data);
};

export const login = async (data) => {
  return axios.post(`${API_URL}/login`, data);
};
