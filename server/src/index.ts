// server/src/index.ts
/**
 * ==============================================================================
 * ENTRY POINT SERVER
 * ==============================================================================
 * File ini bertugas untuk inisialisasi aplikasi Express, middleware global,
 * koneksi database, dan pendaftaran rute API.
 */

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

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

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;

/**
 * ------------------------------------------------------------------------------
 * MIDDLEWARES GLOBAL
 * ------------------------------------------------------------------------------
 */
// KONFIGURASI CORS YANG LEBIH KUAT
// Izinkan secara eksplisit domain frontend
const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',') 
    : [];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Izinkan method ini
    allowedHeaders: ['Content-Type', 'Authorization'],    // Izinkan header ini
    credentials: true // Izinkan cookies/session (penting agar tidak dianggap spam)
}));
app.use(express.json());         // Parser untuk payload JSON
app.use(express.urlencoded({ extended: true })); // Parser untuk form-data

app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, '../uploads')));

/**
 * ------------------------------------------------------------------------------
 * HEALTH CHECK DATABASE
 * ------------------------------------------------------------------------------
 * Memastikan koneksi ke MySQL berhasil sebelum server menerima request.
 */
pool.getConnection()
    .then(connection => {
        console.log("✅ Database: Terhubung ke MySQL");
        connection.release();
    })
    .catch(err => {
        console.error("❌ Database: Gagal terhubung.", err);
        // Opsional: process.exit(1) jika database wajib ada untuk aplikasi berjalan
    });

/**
 * ------------------------------------------------------------------------------
 * API ROUTES
 * ------------------------------------------------------------------------------
 */

// Root Endpoint (Cek Status Server)
app.get('/', (req: Request, res: Response) => {
    res.send({ 
        message: 'Community System API is running correctly.', 
        version: '1.0.0' 
    });
});

// 1. System & Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 2. Content Management Routes
app.use('/api/authors', authorRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/fanzines', fanzineRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/videos', videosRoutes);

/**
 * ------------------------------------------------------------------------------
 * START SERVER
 * ------------------------------------------------------------------------------
 */
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});