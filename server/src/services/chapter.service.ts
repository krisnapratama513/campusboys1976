// server/src/services/chapter.service.ts

import { pool } from '../config/database';
import type { RowDataPacket } from 'mysql2';

export const fetchAllChapters = async () => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM chapters'
    );
    return rows;
};

export const fetchChapterList = async () => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT id, name, img FROM chapters'
    );
    return rows;
};