// server/src/services/fanzine.service.ts

import { pool } from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Fanzine extends RowDataPacket {
    id: number;
    title: string;
    date: Date;
    slug: string;
    imgFilename: string;
    pdfFilename: string;
    author_name: string;
}

export const createFanzineInitial = async (data: { title: string, date: string, author_id: number }) => {
    const { title, date, author_id } = data;
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO fanzines (title, date, author_id) VALUES (?, ?, ?)`,
        [title, date, author_id]
    );
    return result.insertId; // <--- KITA BUTUH INI
};

export const getFanzineById = async (id: number) => {
    const [rows] = await pool.execute<Fanzine[]>(
        `SELECT * FROM fanzines WHERE id = ?`, [id]
    );
    return rows[0];
};

// 2. Update Info Teks (Tambahkan ini)
export const updateFanzineInfo = async (id: number, data: { title: string, date: string, author_id: number }) => {
    const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE fanzines SET title=?, date=?, author_id=? WHERE id=?`,
        [data.title, data.date, data.author_id, id]
    );
    return result;
};

export const updateFanzineFiles = async (
    id: number, 
    data: { 
        slug: string, 
        imgFilename?: string | null, // <--- Ubah ini
        pdfFilename?: string | null  // <--- Ubah ini
    }
) => {
    let sql = `UPDATE fanzines SET slug = ?`;
    const params: (string|number)[] = [data.slug];

    // Cek if (data.imgFilename) otomatis aman (karena null/undefined dianggap false)
    if (data.imgFilename) {
        sql += `, imgFilename = ?`;
        params.push(data.imgFilename);
    }
    if (data.pdfFilename) {
        sql += `, pdfFilename = ?`;
        params.push(data.pdfFilename);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    const [result] = await pool.execute<ResultSetHeader>(sql, params);
    return result;
};

export const getAllFanzines = async () => {
    // const [rows] = await pool.execute<RowDataPacket[]>(
    const [rows] = await pool.execute<Fanzine[]>(
        `SELECT 
            f.id,
            f.title,
            f.date,
            f.slug,
            f.imgFilename,
            f.pdfFilename,
            a.name AS author_name
        FROM fanzines AS f
        JOIN authors AS a ON f.author_id = a.id
        ORDER BY id DESC`
    );
    return rows
}

export const getFanzineBySlug = async (slug: string) => {
    if (!slug) return null; // Langsung return null

    const [rows] = await pool.execute<Fanzine[]>(
        `SELECT 
            f.id,
            f.title,
            f.date,
            f.slug,
            f.imgFilename,
            f.pdfFilename,
            a.name AS author_name
        FROM fanzines AS f
        JOIN authors AS a ON f.author_id = a.id
        WHERE f.slug = ?`,
        [slug]
    );
    return rows[0] || null;
}


export const deleteFanzine = async (id: number) => {
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM fanzines WHERE id = ?', 
        [id]
    );
    return result;
};
