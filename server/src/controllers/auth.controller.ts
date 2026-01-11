// server/src/controllers/auth.controller.ts

/**
 * ==============================================================================
 * AUTH CONTROLLER
 * ==============================================================================
 * Menangani request/response HTTP untuk fitur autentikasi.
 */

import type { Request, Response } from 'express';
import * as authService from '../services/auth.service';

/**
 * Login User.
 * Menerima username & password, mengembalikan Token JWT jika valid.
 * * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // 1. Validasi Input Dasar
        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan Password wajib diisi' });
        }

        // 2. Panggil Business Logic di Service
        const result = await authService.loginUser(username, password);

        // 3. Kirim Respon Sukses (200 OK)
        res.json({
            message: 'Login berhasil',
            data: result
        });

    } catch (error: any) {
        console.error("[AuthController] Login Error:", error.message);
        
        // Penanganan Error Spesifik (User Friendly)
        if (error.message === 'Username tidak ditemukan' || error.message === 'Password salah') {
            // Gunakan 401 (Unauthorized) untuk kegagalan login
            return res.status(401).json({ message: 'Username atau Password salah' });
        }
        
        // Penanganan Error Server (Generic)
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};