/**
 * ==============================================================================
 * VIDEO SERVICE
 * ==============================================================================
 * Menangani logika database untuk Video.
 */

import { pool } from '../config/database';
import type { Video, VideoInput } from '../types/video.types';
import type { ResultSetHeader } from 'mysql2';

/**
 * PUBLIC: Mengambil video yang statusnya AKTIF (is_active = 1).
 */
export const getPublicVideos = async (): Promise<Video[]> => {
    const [rows] = await pool.execute<Video[]>(
        `SELECT * FROM videos WHERE is_active = 1 ORDER BY id DESC`
    );
    return rows;
};

/**
 * ADMIN: Mengambil SEMUA video (termasuk yang disembunyikan).
 */
export const getAllVideos = async (): Promise<Video[]> => {
    const [rows] = await pool.execute<Video[]>(
        `SELECT * FROM videos ORDER BY id DESC`
    );
    return rows;
};

/**
 * Mengambil detail video by ID.
 */
export const getVideoById = async (id: number): Promise<Video | undefined> => {
    const [rows] = await pool.execute<Video[]>(
        `SELECT * FROM videos WHERE id = ?`, 
        [id]
    );
    return rows[0];
};

/**
 * Menyimpan video baru.
 */
export const createVideo = async (data: VideoInput) => {
    const { title, youtube_id, description, is_active } = data;
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO videos (title, youtube_id, description, is_active) 
         VALUES (?, ?, ?, ?)`,
        [title, youtube_id, description, is_active]
    );
    return result.insertId;
};

/**
 * Update data video.
 */
export const updateVideo = async (id: number, data: VideoInput) => {
    const { title, youtube_id, description, is_active } = data;
    await pool.execute(
        `UPDATE videos SET title = ?, youtube_id = ?, description = ?, is_active = ? WHERE id = ?`,
        [title, youtube_id, description, is_active, id]
    );
};

/**
 * Hapus video.
 */
export const deleteVideo = async (id: number) => {
    await pool.execute(`DELETE FROM videos WHERE id = ?`, [id]);
};