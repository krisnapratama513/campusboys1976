// server/src/controllers/videos.controller.ts

import type { Request, Response } from "express";
import { pool } from '../index'

export const getAllVideos = async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM videos ORDER BY id DESC');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error("Error saat query getAllVideos: ", error);
        res.status(500).json({ message: "gagal mengambil data getAllVideos" });
    }
}