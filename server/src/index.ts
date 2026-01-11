// server/src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; // Import path untuk folder uploads

// --- IMPORT CONFIG ---
import { pool } from './config/database'; 

// --- IMPORT ROUTES ---
// A. System & Auth Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import dashboardRoutes from './routes/dashboard.routes';
import authorRoutes from './routes/author.routes';

// B. Content Routes
import chapterRoutes from './routes/chapter.routes'; 
import articleRoutes from './routes/article.routes';
import fanzineRoutes from './routes/fanzine.routes';
import albumRoutes from './routes/album.routes';
import videosRoutes from './routes/videos.routes';

// --- CONFIGURATION ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000; // Pastikan port sesuai .env (biasanya 8000)

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// [PENTING] Serve Static Files (Agar gambar profil/cover bisa diakses)
// Ini membuat folder 'uploads' bisa diakses via URL: http://localhost:3000/uploads/...
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- DATABASE CONNECTION CHECK ---
pool.getConnection()
    .then(connection => {
        console.log("✅ Berhasil terhubung ke MySQL");
        connection.release();
    })
    .catch(err => {
        console.error("❌ Gagal koneksi ke MySQL:", err);
    });

// --- ROUTES REGISTRATION ---

// 1. Root Check
app.get('/', (req, res) => {
    res.send('Server backend Community System berjalan! 🚀');
});

// 2. System & Auth APIs
app.use('/api/auth', authRoutes);         // Login & Register
app.use('/api/users', userRoutes);        // User Management & Profile
app.use('/api/dashboard', dashboardRoutes); // Dashboard Stats
app.use('/api/authors', authorRoutes);    // Authors Management

// 3. Content APIs
app.use('/api/chapters', chapterRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/fanzines', fanzineRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/videos', videosRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});