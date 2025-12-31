import type { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Validasi input kosong
        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan Password wajib diisi' });
        }

        // Panggil Service
        const result = await authService.loginUser(username, password);

        // Kirim respon sukses
        res.json({
            message: 'Login berhasil',
            data: result
        });

    } catch (error: any) {
        console.error("Login Error:", error.message);
        // Jika error "Username tidak ditemukan" atau "Password salah", beri status 401
        if (error.message === 'Username tidak ditemukan' || error.message === 'Password salah') {
            return res.status(401).json({ message: 'Username atau Password salah' });
        }
        
        // Error server lainnya
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};