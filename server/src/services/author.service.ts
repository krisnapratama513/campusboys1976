// server/src/services/author.service.ts

import { pool } from '../config/database';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

// Interface untuk data yang keluar dari DB
interface Author extends RowDataPacket {
    id: number;
    name: string;
}

interface AuthorWithStats extends Author {
    total_articles: number;
    total_fanzine: number;
}

export const getAllAuthors = async () => {
    // HAPUS a.created_at dari SELECT
    const query = `
        SELECT 
            a.id, 
            a.name,
            (SELECT COUNT(*) FROM articles WHERE id_author = a.id) AS total_articles,
            (SELECT COUNT(*) FROM fanzines WHERE author_id = a.id) AS total_fanzine
        FROM authors AS a
        ORDER BY a.id
    `;
    const [rows] = await pool.execute<AuthorWithStats[]>(query);
    return rows;
};

export const createAuthor = async (name: string) => {
    // Logic insert pindah ke sini
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO authors (name) VALUES (?)', 
        [name]
    );
    return result;
};

export const getAuthorById = async (id: number) => {
    const [rows] = await pool.execute<Author[]>(
        'SELECT * FROM authors WHERE id = ?', 
        [id]
    );
    return rows[0]; // Kembalikan baris pertama saja
};

// 2. Fungsi untuk Update data
export const updateAuthor = async (id: number, name: string) => {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE authors SET name = ? WHERE id = ?',
        [name, id]
    );
    return result;
};

export const deleteAuthor = async (id: number) => {
    // Jika author dipakai di tabel lain (Foreign Key), baris ini akan melempar ERROR otomatis
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM authors WHERE id = ?', 
        [id]
    );
    return result;
};