// server/src/services/album.service.ts

import { pool } from '../config/database'; // Import dari file config baru
import type { RowDataPacket } from 'mysql2';

// Kita definisikan tipe return (opsional tapi bagus untuk TS)
interface Album {
    id: number;
    title: string;
    description: string;
    date: string;
}

export const fetchAllPublishedAlbums = async () => {
    // Menggunakan pool.execute langsung (otomatis release connection)
    // untuk query sederhana
    const [rows] = await pool.execute(
        `SELECT
            id,
            title,
            name,
            description,
            image,
            DATE(date) as date
        FROM album
        WHERE status = 'publish'`
    );
    return rows;
};

export const fetchAlbumDetailById = async (id: string) => {
    const connection = await pool.getConnection();

    try {
        // 1. Ambil data Album
        const [albumRows] = await connection.execute<RowDataPacket[]>(
            `SELECT id, title, description, DATE(date) as date 
             FROM album WHERE id = ? AND status = 'publish'`,
            [id]
        );

        // Jika tidak ketemu, kembalikan null
        if (albumRows.length === 0) {
            return null;
        }

        // 2. Ambil data Foto terkait
        const [photoRows] = await connection.execute(
            `SELECT id, image_filename, created_at 
             FROM photo WHERE album_id = ? ORDER BY id DESC`,
            [id]
        );

        // 3. Gabungkan data
        return {
            ...albumRows[0],
            photos: photoRows
        };

    } finally {
        // PENTING: Selalu release koneksi baik sukses maupun error
        connection.release();
    }
};