// server/src/service/video.service.ts

import { pool } from '../config/database';
import type { RowDataPacket } from 'mysql2';

export const fetchAllVideos = async () => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM videos ORDER BY id DESC'
    );
    return rows;
};