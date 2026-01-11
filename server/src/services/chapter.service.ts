// server/src/services/chapter.service.ts

import { pool } from '../config/database';
import type { ResultSetHeader } from 'mysql2';
import type { Chapter } from '../types/chapter.types';

export const getAllChapters = async () => {
    const [rows] = await pool.execute<Chapter[]>('SELECT * FROM chapters ORDER BY id');
    return rows;
};

export const getAllImageChapters = async () => {
    const [rows] = await pool.execute<Chapter[]>('SELECT id, img FROM chapters ORDER BY id');
    return rows;
};

export const getChapterById = async (id: number) => {
    const [rows] = await pool.execute<Chapter[]>('SELECT * FROM chapters WHERE id = ?', [id]);
    return rows[0] || null;
};

export const createChapter = async (name: string, description: string, img: string) => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO chapters (name, description, img) VALUES (?, ?, ?)',
        [name, description, img]
    );
    return result.insertId;
};

export const updateChapter = async (id: number, name: string, description: string, img?: string) => {
    if (img) {
        // Update dengan gambar baru
        await pool.execute(
            'UPDATE chapters SET name = ?, description = ?, img = ? WHERE id = ?',
            [name, description, img, id]
        );
    } else {
        // Update data saja (gambar tetap)
        await pool.execute(
            'UPDATE chapters SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
    }
};

export const deleteChapter = async (id: number) => {
    await pool.execute('DELETE FROM chapters WHERE id = ?', [id]);
};