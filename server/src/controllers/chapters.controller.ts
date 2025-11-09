// server/src/controllers/chapters.controller.ts

import type { Request, Response } from 'express';
import { pool } from '../index';

export const getAllChapters = async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM chapters');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error("Error saat query databse: ", error);
        res.status(500).json({ message: "gagal mengambil data dari database" });
    }
};

export const getChapterList = async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.execute(
            'SELECT id, name, img FROM chapters'
        );

        connection.release();
        res.json(rows);
    } catch (error){
        console.error("Error saat query chaper list: ", error);
        res.status(500).json({message: "gagal mengambil data list chapter"});
    }
};