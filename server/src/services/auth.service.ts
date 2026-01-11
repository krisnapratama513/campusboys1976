// server/src/services/auth.service.ts

/**
 * ==============================================================================
 * AUTH SERVICE
 * ==============================================================================
 * Menangani logika bisnis untuk autentikasi user.
 * Cakupan: Verifikasi kredensial database, hashing password, dan pembuatan JWT.
 */

import { pool } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';
import { LoginResponse, JwtPayload, UserRole } from '../types/auth.types'; 

// Konfigurasi Secret Key untuk signing token
// PENTING: Value ini harus sinkron dengan yang ada di auth.middleware.ts
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara_api_123';

// Interface internal untuk mapping hasil query database
interface UserRow extends RowDataPacket {
    id: number;
    username: string;
    password: string;
    role: string; 
    chapter_id: number;
}

/**
 * Memproses login user dengan memverifikasi username dan password.
 * @param username Input username dari client
 * @param plainPassword Input password mentah dari client
 * @returns Promise berisi Token JWT dan informasi User dasar
 * @throws Error jika username tidak ditemukan atau password salah
 */
export const loginUser = async (username: string, plainPassword: string): Promise<LoginResponse> => {
    // 1. Query Database: Cari user berdasarkan username
    const [rows] = await pool.execute<UserRow[]>(
        'SELECT id, username, password, role, chapter_id FROM members WHERE username = ?',
        [username]
    );

    // Validasi ketersediaan user
    if (rows.length === 0) {
        throw new Error('Username tidak ditemukan');
    }

    // Type Assertion: Memastikan compiler TypeScript bahwa object user valid (tidak undefined)
    const user = rows[0] as UserRow; 
    
    // 2. Verifikasi Password: Bandingkan hash di DB dengan input user
    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (!isMatch) {
        throw new Error('Password salah');
    }

    // 3. Persiapan Payload Token
    // Casting string role dari database ke tipe UserRole yang valid
    const role = user.role as UserRole;

    const tokenPayload: JwtPayload = {
        id: user.id,
        username: user.username,
        role: role,
        chapter_id: user.chapter_id 
    };

    // 4. Generate Token JWT (Berlaku 1 Hari)
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    // 5. Return Response Data
    return {
        token,
        id: user.id,
        username: user.username,
        role: role,
        chapter_id: user.chapter_id
    };
};