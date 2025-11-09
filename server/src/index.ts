// server/src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2/promise';

// 1. Impor router, pastikan TANPA '.js'
import chapterRoutes from './routes/chapter.routes'; 

// Membuat variable dari file .env
dotenv.config();

// Membuat aplikasi server
const app = express();
app.use(cors());

// Menentukan port
const port = process.env.PORT || 3000;

// Membuat koneksi pool ke Database
// Pool lebih efisien daripada koneksi tunggal
export const pool = mysql.createPool({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("Mencoba terhubung ke MySQL...");

// Rute tes (boleh disimpan)
app.get('/', (req, res) => {
    res.send('Server backend berhasil berjalan! 🚀');
});


// 3. GUNAKAN ROUTER BARU
// Memberitahu Express: "Untuk semua URL yang diawali '/api/chapters',
// serahkan penanganannya ke file 'chapterRoutes'"
app.use('/api/chapters', chapterRoutes);


// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});