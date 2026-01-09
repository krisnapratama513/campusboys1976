import { pool } from '../config/database';
import type { Video } from '../types/video.types';
import type { ResultSetHeader } from 'mysql2';

// --- PUBLIC ---
export const getPublicVideos = async () => {
    // Hanya ambil yang is_active = 1
    const [rows] = await pool.execute<Video[]>(
        `SELECT * FROM videos WHERE is_active = 1 ORDER BY id DESC`
    );
    return rows;
};

// --- ADMIN ---
export const getAllVideos = async () => {
    const [rows] = await pool.execute<Video[]>(
        `SELECT * FROM videos ORDER BY id DESC`
    );
    return rows;
};

export const getVideoById = async (id: number) => {
    const [rows] = await pool.execute<Video[]>(
        `SELECT * FROM videos WHERE id = ?`, 
        [id]
    );
    return rows[0] || null;
};

export const createVideo = async (data: { title: string, youtube_id: string, description: string, is_active: number }) => {
    const { title, youtube_id, description, is_active } = data;
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO videos (title, youtube_id, description, is_active) 
         VALUES (?, ?, ?, ?)`,
        [title, youtube_id, description, is_active]
    );
    return result.insertId;
};

export const updateVideo = async (id: number, data: { title: string, youtube_id: string, description: string, is_active: number }) => {
    const { title, youtube_id, description, is_active } = data;
    await pool.execute(
        `UPDATE videos SET title = ?, youtube_id = ?, description = ?, is_active = ? WHERE id = ?`,
        [title, youtube_id, description, is_active, id]
    );
};

export const deleteVideo = async (id: number) => {
    await pool.execute(`DELETE FROM videos WHERE id = ?`, [id]);
};