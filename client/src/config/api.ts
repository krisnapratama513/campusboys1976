// Mengambil dari .env (Vite menggunakan import.meta.env)
// Jika tidak ada di .env, fallback ke localhost (safety net)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';