// server/src/controllers/chapters.controller.ts

// 1. Gunakan 'import type' untuk tipe data
import type { Request, Response } from 'express';
// 2. Tambahkan ekstensi '.js' pada file impor lokal
import { pool } from '../index.js';

export const getAllChapters = async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM chapters');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error("Error saat query databse: ", error);
        res.status(500).json({message: "gagal mengambil data dari database"});
    }
};