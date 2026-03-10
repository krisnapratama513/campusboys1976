// server/src/services/fanzine.service.ts

/**
 * ==============================================================================
 * FANZINE SERVICE
 * ==============================================================================
 * Logika database untuk modul Fanzine (Majalah Digital).
 */

import { pool } from '../config/database';
import { RowDataPacket, type ResultSetHeader } from 'mysql2';
import type { Fanzine, FanzineInput } from '../types/fanzine.types';
import { count } from 'console';

/**
 * Langkah 1 Create: Insert Data Awal (Title, Date, Author).
 * Kita butuh ID-nya untuk penamaan file yang rapi.
 */
export const createFanzineInitial = async (data: FanzineInput) => {
    const { title, date, author_id } = data;
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO fanzines (title, date, author_id) VALUES (?, ?, ?)`,
        [title, date, author_id]
    );
    return result.insertId; 
};

/**
 * Langkah 2 Create: Update nama file setelah file berhasil di-rename.
 */
export const updateFanzineFiles = async (
    id: number, 
    data: { slug: string, imgFilename?: string | null, pdfFilename?: string | null }
) => {
    let sql = `UPDATE fanzines SET slug = ?`;
    const params: (string|number)[] = [data.slug];

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

/**
 * Update Info Teks (Title, Date, Author).
 */
export const updateFanzineInfo = async (id: number, data: FanzineInput) => {
    const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE fanzines SET title=?, date=?, author_id=? WHERE id=?`,
        [data.title, data.date, data.author_id, id]
    );
    return result;
};

/**
 * Get All Fanzines (Join Author).
 * pagination
 */
export const getAllFanzines = async (limit: number, offset: number) => {
    // 1. Gunakan pool.query untuk menghindari error Prepared Statement pada LIMIT
    const [rows] = await pool.query<Fanzine[]>(
        `SELECT 
            f.id, f.title, f.date, f.slug, f.imgFilename, f.pdfFilename,
            a.name AS author_name
        FROM fanzines AS f
        JOIN authors AS a ON f.author_id = a.id
        ORDER BY f.date DESC
        LIMIT ? OFFSET ?`, 
        [limit, offset]
    );

    // 2. Hitung total fanzines
    const [countResult] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(id) as total FROM fanzines`
    );

    const totalItems = countResult[0]?.total || 0;
    
    // 3. Return object yang berisi data dan total item
    return { fanzines: rows, totalItems };
};

/** Ambil 8 terbaru untuk Carousel Home */
export const getRecentFanzinesCarousel = async () => {
    const [rows] = await pool.query(
        `SELECT id, slug, imgFilename, title 
         FROM fanzines 
         ORDER BY date DESC 
         LIMIT 8`
    );
    return rows;
};

/**
 * Get By ID.
 */
export const getFanzineById = async (id: number): Promise<Fanzine | undefined> => {
    const [rows] = await pool.execute<Fanzine[]>(
        `SELECT * FROM fanzines WHERE id = ?`, [id]
    );
    return rows[0];
};

/**
 * Get By Slug (Public View).
 */
export const getFanzineBySlug = async (slug: string): Promise<Fanzine | undefined> => {
    if (!slug) return undefined;

    const [rows] = await pool.execute<Fanzine[]>(
        `SELECT 
            f.id, f.title, f.date, f.slug, f.imgFilename, f.pdfFilename,
            a.name AS author_name
        FROM fanzines AS f
        JOIN authors AS a ON f.author_id = a.id
        WHERE f.slug = ?`,
        [slug]
    );
    return rows[0];
}

/**
 * Delete Fanzine.
 */
export const deleteFanzine = async (id: number) => {
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM fanzines WHERE id = ?', 
        [id]
    );
    return result;
};