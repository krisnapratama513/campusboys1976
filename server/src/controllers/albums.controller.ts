// server/src/controllers/albums.controller.ts

import type { Request, Response } from 'express';
import { pool } from '../index';

export const getPublicAlbums = async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
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

        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPublicAlbumById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let connection;

    try {
        connection = await pool.getConnection();

        // 1. Ambil data Album
        const [albumRows]: any = await connection.execute(
            `SELECT id, title, description, DATE(date) as date 
             FROM album WHERE id = ? AND status = 'publish'`,
            [id]
        );

        if (albumRows.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Album not found' });
        }

        // 2. Ambil data Foto terkait
        const [photoRows] = await connection.execute(
            `SELECT id, image_filename, created_at 
             FROM photo WHERE album_id = ? ORDER BY id DESC`,
            [id]
        );

        connection.release();

        // 3. Gabungkan response
        res.json({
            ...albumRows[0],
            photos: photoRows
        });

    } catch (error) {
        if (connection) connection.release();
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
