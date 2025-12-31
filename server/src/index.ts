// // server/src/index.ts

// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import mysql from 'mysql2/promise';

// // 1. Impor router, pastikan TANPA '.js'
// import chapterRoutes from './routes/chapter.routes'; 
// import articleRoutes from './routes/article.routes';
// import videosRoutes from './routes/videos.routes';
// import albumRoutes from './routes/album.routes';

// // Membuat variable dari file .env
// dotenv.config();

// // Membuat aplikasi server
// const app = express();
// app.use(cors());

// // Menentukan port
// const port = process.env.PORT || 3000;

// // Membuat koneksi pool ke Database
// // Pool lebih efisien daripada koneksi tunggal
// export const pool = mysql.createPool({
//     host: process.env.DB_HOST as string,
//     user: process.env.DB_USER as string,
//     password: process.env.DB_PASSWORD as string,
//     database: process.env.DB_NAME as string,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//     timezone: 'UTC'
// });

// console.log("Mencoba terhubung ke MySQL...");

// // Rute tes (boleh disimpan)
// app.get('/', (req, res) => {
//     res.send('Server backend berhasil berjalan! 🚀');
// });



// // Memberitahu Express: "Untuk semua URL yang diawali '/api/',
// // serahkan penanganannya ke file 'chapterRoutes'"
// app.use('/api/chapters', chapterRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/videos', videosRoutes);
// app.use('/api/albums',albumRoutes);


// // Jalankan server
// app.listen(port, () => {
//     console.log(`Server berjalan di http://localhost:${port}`);
// });



// server/src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Routes
import chapterRoutes from './routes/chapter.routes'; 
import articleRoutes from './routes/article.routes';
import videosRoutes from './routes/videos.routes';
import albumRoutes from './routes/album.routes';

// Import Pool dari config (Hanya untuk cek koneksi saat startup)
import { pool } from './config/database'; 

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

// Cek koneksi DB saat server nyala (Opsional tapi bagus)
pool.getConnection()
    .then(connection => {
        console.log("✅ Berhasil terhubung ke MySQL");
        connection.release();
    })
    .catch(err => {
        console.error("❌ Gagal koneksi ke MySQL:", err);
    });

app.get('/', (req, res) => {
    res.send('Server backend berhasil berjalan! 🚀');
});

// Routes
app.use('/api/chapters', chapterRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/albums', albumRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});