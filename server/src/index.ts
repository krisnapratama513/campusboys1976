// server/src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Routes
import chapterRoutes from './routes/chapter.routes'; 
import articleRoutes from './routes/article.routes';
import videosRoutes from './routes/videos.routes';
import albumRoutes from './routes/album.routes';

import authRoutes from './routes/auth.routes';

// Import Pool dari config (Hanya untuk cek koneksi saat startup)
import { pool } from './config/database'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Supaya bisa baca JSON dari React
app.use(express.urlencoded({ extended: true })); // (Opsional) Supaya bisa baca form data url-encoded
// ----------------------------------
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

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});