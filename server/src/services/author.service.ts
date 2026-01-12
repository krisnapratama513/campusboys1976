// server/src/services/author.service.ts

/**
 * ==============================================================================
 * AUTHOR SERVICE
 * ==============================================================================
 * Menangani logika bisnis untuk manajemen Penulis.
 * Termasuk menghitung statistik jumlah karya per penulis.
 */

import { pool } from '../config/database';
import type { ResultSetHeader } from 'mysql2';
import type { Author, AuthorWithStats } from '../types/author.types';

/**
 * Mengambil semua author beserta statistik karyanya.
 * Query menggunakan sub-query untuk menghitung total artikel dan fanzine.
 */
export const getAllAuthors = async (): Promise<AuthorWithStats[]> => {
    const query = `
        SELECT 
            a.id, 
            a.name,
            (SELECT COUNT(*) FROM articles WHERE id_author = a.id) AS total_articles,
            (SELECT COUNT(*) FROM fanzines WHERE author_id = a.id) AS total_fanzine
        FROM authors AS a
        ORDER BY a.id ASC
    `;
    const [rows] = await pool.execute<AuthorWithStats[]>(query);
    return rows;
};

/**
 * Mengambil satu author berdasarkan ID.
 * @param id ID Author
 */
export const getAuthorById = async (id: number): Promise<Author | undefined> => {
    const [rows] = await pool.execute<Author[]>(
        'SELECT * FROM authors WHERE id = ?', 
        [id]
    );
    return rows[0];
};

/**
 * Membuat author baru.
 * @param name Nama Author
 */
export const createAuthor = async (name: string) => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO authors (name) VALUES (?)', 
        [name]
    );
    return result;
};

/**
 * Mengupdate nama author.
 * @param id ID Author
 * @param name Nama Baru
 */
export const updateAuthor = async (id: number, name: string) => {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE authors SET name = ? WHERE id = ?',
        [name, id]
    );
    return result;
};

/**
 * Menghapus author.
 * Hati-hati: Akan gagal jika author masih memiliki artikel/fanzine (Constraint FK).
 */
export const deleteAuthor = async (id: number) => {
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM authors WHERE id = ?', 
        [id]
    );
    return result;
};