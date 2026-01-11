// server/src/services/chapter.service.ts

import { pool } from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { Chapter } from '../types/chapter.types';

/**
 * Mengambil semua data chapter, diurutkan berdasarkan ID.
 * @returns Array of Chapter
 */
export const getAllChapters = async () => {
    const [rows] = await pool.execute<Chapter[] & RowDataPacket[]>('SELECT * FROM chapters ORDER BY id');
    return rows;
};

/**
 * Mengambil hanya ID dan Gambar (untuk keperluan HomePage (chapters caoursel)).
 * @returns Array of object {id, img}
 */
export const getAllImageChapters = async () => {
    const [rows] = await pool.execute<Chapter[] & RowDataPacket[]>('SELECT id, img FROM chapters ORDER BY id');
    return rows;
};

/**
 * Mencari detail chapter berdasarkan ID.
 * @param id ID Chapter
 * @returns Object Chapter atau null jika tidak ditemukan
 */
export const getChapterById = async (id: number) => {
    const [rows] = await pool.execute<Chapter[] & RowDataPacket[]>('SELECT * FROM chapters WHERE id = ?', [id]);
    return rows[0] || null;
};

/**
 * Menyimpan chapter baru ke database.
 * @param name Nama Chapter
 * @param description Deskripsi singkat
 * @param img Nama file gambar (termasuk ekstensi)
 */
export const createChapter = async (name: string, description: string, img: string) => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO chapters (name, description, img) VALUES (?, ?, ?)',
        [name, description, img]
    );
    return result.insertId;
};

/**
 * Memperbarui data chapter. 
 * Jika parameter 'img' ada, berarti user mengupload gambar baru.
 */
export const updateChapter = async (id: number, name: string, description: string, img?: string) => {
    if (img) {
        // Update data beserta gambar baru
        await pool.execute(
            'UPDATE chapters SET name = ?, description = ?, img = ? WHERE id = ?',
            [name, description, img, id]
        );
    } else {
        // Update teks saja, pertahankan gambar lama
        await pool.execute(
            'UPDATE chapters SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
    }
};

/**
 * Menghapus data chapter dari database.
 * (File fisik dihapus di controller sebelum memanggil fungsi ini).
 */
export const deleteChapter = async (id: number) => {
    await pool.execute('DELETE FROM chapters WHERE id = ?', [id]);
};