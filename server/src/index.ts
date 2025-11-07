// server/src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2/promise';

// Membuat variable dari file .env
dotenv.config();

// Membuat aplikasi server
const app = express();
app.use(cors());

// Menentukan port
const port = process.env.PORT || 3000;

// Membuat koneksi pool ke Database
// Pool lebih efisien daripada koneksi tunggal
const pool = mysql.createPool({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("Mencoba terhubung ke MySQL...");

app.get('/', (req, res) => {
    res.send('Server backend berhasil berjalan! 🚀');
});


app.get('/api/chapters', async (req, res) => {
    try {
        // Ambil koneksi dari pool
        const connection = await pool.getConnection();

        // Jalankan query SQL
        const [rows] = await connection.execute(
            'SELECT id AS id_chapter, name AS nama_chapter, description AS deskripsi, img FROM chapters'
        );

        // Kembalikan koneksi ke pool
        connection.release();

        // kirim hasil query sebagai JSON
        res.json(rows);

    } catch (error) {
        console.error("Error saat query database:", error);
        res.status(500).json({ message: "Gagal mengambil data dari database" });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
