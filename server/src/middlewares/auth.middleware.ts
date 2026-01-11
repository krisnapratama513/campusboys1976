// server/src/middlewares/auth.middleware.ts

/**
 * ==============================================================================
 * AUTH MIDDLEWARE
 * ==============================================================================
 * Berfungsi sebagai "Gatekeeper" untuk memproteksi route API.
 * 1. authenticateToken: Memvalidasi keaslian Token JWT.
 * 2. requireRole: Memvalidasi hak akses (Role-Based Access Control).
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../config/permissions';

// Memperluas tipe Request Express untuk menyisipkan data user hasil dekripsi token
export interface AuthRequest extends Request {
    user?: {
        id: number;
        username: string;
        role: UserRole;
        chapter_id?: number;
    };
}

/**
 * Middleware untuk memvalidasi Token JWT pada header Authorization.
 * Format Header: "Authorization: Bearer <token>"
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // Mengambil token setelah kata 'Bearer'
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    // Secret Key (Wajib sama dengan auth.service.ts)
    const secret = process.env.JWT_SECRET || 'rahasia_negara_api_123'; 

    jwt.verify(token, secret, (err: any, user: any) => {
        if (err) {
            // Log error ke console server untuk debugging, tapi kirim pesan umum ke client
            console.error("[AuthMiddleware] JWT Verify Error:", err.message); 
            return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
        }

        // Menyisipkan data user ke objek request agar bisa diakses controller selanjutnya
        (req as AuthRequest).user = user;
        next();
    });
};

/**
 * Factory Function untuk membuat middleware validasi Role.
 * @param allowedRoles Array role yang diizinkan mengakses route ini
 */
export const requireRole = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;

        // Pastikan user sudah lolos autentikasi token sebelumnya
        if (!authReq.user) {
            return res.status(401).json({ message: 'User tidak terautentikasi.' });
        }

        // Cek apakah role user termasuk dalam daftar yang diizinkan
        if (!allowedRoles.includes(authReq.user.role)) {
            return res.status(403).json({ 
                message: `Akses dilarang. Role Anda (${authReq.user.role}) tidak memiliki izin.` 
            });
        }

        next();
    };
};