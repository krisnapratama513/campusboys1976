// server/src/services/auth.service.ts

import { pool } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { RowDataPacket } from 'mysql2';
import type { LoginResponse, JwtPayload, UserRole } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara_api_123';

// 1. Definisikan Interface agar TypeScript tidak merah-merah
interface UserRow extends RowDataPacket {
    id: number;
    username: string;
    password: string;
    role: string;
}

export const loginUser = async (username: string, plainPassword: string): Promise<LoginResponse> => {
    // 2. Gunakan <UserRow[]>
    const [rows] = await pool.execute<UserRow[]>(
        'SELECT id, username, password, role FROM members WHERE username = ?',
        [username]
    );

    if (rows.length === 0) {
        throw new Error('Username tidak ditemukan');
    }

    // 3. Paksa tipe data menjadi UserRow
    const user = rows[0] as UserRow;
    
    // 4. Cek Password
    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (!isMatch) {
        throw new Error('Password salah');
    }

    const tokenPayload: JwtPayload = {
        id: user.id,
        username: user.username,
        role: user.role as UserRole
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    return {
        token,
        username: user.username,
        role: user.role as UserRole
    };
};