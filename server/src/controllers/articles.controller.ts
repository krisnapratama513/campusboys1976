// server/src/controllers/articles.controller.ts

import type { Request, Response } from 'express';
import { pool } from '../index';

export const getRecentArticlesCard = async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `SELECT
                a.id,
                a.slug,
                a.img,
                a.title,
                a.created_at,
                a.description,
                b.name AS author_name 
            FROM articles AS a
            JOIN authors AS b ON a.id_author = b.id
            ORDER BY a.id DESC
            LIMIT 5`
        );

        connection.release();
        res.json(rows);
    } catch (error) {
        console.error("Error saat query  getRecentArticlesCard: ", error);
        res.status(500).json({ message: "gagal mengambil data getRecentArticlesCard" });
    }
};