// server/src/services/auth.service.ts

import { pool } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { RowDataPacket } from 'mysql2';
import type { LoginResponse, JwtPayload, UserRole } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara_api_123';

// 1. Update Interface UserRow agar sesuai database baru
interface UserRow extends RowDataPacket {
    id: number;
    username: string;
    password: string;
    role: string;
    chapter_id: number; // <--- TAMBAHKAN INI
}

export const loginUser = async (username: string, plainPassword: string): Promise<LoginResponse> => {
    // 2. Update Query SELECT: Tambahkan 'chapter_id'
    const [rows] = await pool.execute<UserRow[]>(
        'SELECT id, username, password, role, chapter_id FROM members WHERE username = ?',
        [username]
    );

    if (rows.length === 0) {
        throw new Error('Username tidak ditemukan');
    }

    const user = rows[0] as UserRow;
    
    // 3. Cek Password (Tetap sama)
    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (!isMatch) {
        throw new Error('Password salah');
    }

    // 4. Masukkan chapter_id ke dalam Token Payload
    const tokenPayload: JwtPayload = {
        id: user.id,
        username: user.username,
        role: user.role as UserRole,
        chapter_id: user.chapter_id // <--- DATA PENTING
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    return {
        token,
        id: user.id,
        username: user.username,
        role: user.role as UserRole,
        chapter_id: user.chapter_id // <--- Kirim juga ke response JSON
    };
};