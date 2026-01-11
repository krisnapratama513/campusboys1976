import { Request, Response } from 'express';
import { pool } from '../config/database';
// Tidak perlu import RowDataPacket jika kita pakai 'any' untuk simplifikasi di sini

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Kita gunakan Promise.all agar request jalan bebarengan (Paralel)
        const results = await Promise.all([
            pool.execute('SELECT COUNT(*) as total FROM members'),
            pool.execute('SELECT COUNT(*) as total FROM chapters'),
            pool.execute('SELECT COUNT(*) as total FROM articles'),
            pool.execute('SELECT COUNT(*) as total FROM fanzines'),
            pool.execute('SELECT COUNT(*) as total FROM album'),
            pool.execute('SELECT COUNT(*) as total FROM videos')
        ]);

        // Helper function kecil untuk ambil angka 'total' dengan aman
        // Kita paksa tipe-nya jadi 'any' agar TypeScript tidak protes
        const getCount = (result: any) => {
            const rows = result[0]; // Ambil rows dari [rows, fields]
            return rows[0]?.total || 0; // Ambil properti total, atau 0 jika error
        };

        res.json({
            members: getCount(results[0]),
            chapters: getCount(results[1]),
            articles: getCount(results[2]),
            fanzines: getCount(results[3]),
            albums: getCount(results[4]),
            videos: getCount(results[5])
        });

    } catch (error: any) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: error.message });
    }
};