// server/src/index.ts

import express from 'express';
import dotenv from 'dotenv';

// 1. Membuat variable dari file .env (seperti PORT = 8000)
dotenv.config();

// 2. Membuat aplikasi server
const app = express();

// 3. Tentukan port. Ambil dari .env, atau pakai 3000 jika tidak ada
const port = process.env.PORT || 3000;

// 4. Membuat rute (endpoint) 'GET' sederhana untuk tes
// Ini akan merespon di http://localhost:8000/
app.get('/', (req, res) =>{
    res.send('Server backend berhasil berjalan! 🚀');
});

// 5. Mulai jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});