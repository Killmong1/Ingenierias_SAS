// src/api/authService.js
import axios from "axios";

const API_URL = "https://prueba-tech-125.onrender.com/api/v1/auth";

export const signup = async (data) => {
  return axios.post(`${API_URL}/signup`, data);
};

export const login = async (data) => {
  return axios.post(`${API_URL}/login`, data);
};
