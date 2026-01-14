// client/src/config/api.ts

// 1. Cek apakah ada settingan di .env? Kalau tidak ada, pakai Localhost.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// 2. Sama, cek .env dulu. Kalau kosong, pakai Localhost.
export const SERVER_ROOT = import.meta.env.VITE_SERVER_ROOT || "http://localhost:8000";