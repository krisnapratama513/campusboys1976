// server/src/services/article.service.ts

/**
 * ==============================================================================
 * ARTICLE SERVICE
 * ==============================================================================
 * Menangani logika bisnis untuk modul Artikel (Blog/News).
 * Terbagi menjadi 2 bagian: Public (Pengunjung) dan Admin (Management).
 */

import { pool } from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

// Interface untuk data artikel (Sesuaikan dengan kolom DB Anda)
export interface ArticleData {
    id_author: number;
    title: string;
    status: 'publish' | 'pending';
    password?: string | null;
    content: string;
    description?: string | null;
    created_at?: Date;
}

// ==========================================
// BAGIAN 1: PUBLIC (Untuk Pengunjung)
// ==========================================

/**
 * Mengambil 5 artikel terbaru yang statusnya 'publish'.
 * Digunakan untuk widget "Recent Articles" di sidebar atau homepage.
 */
export const fetchRecentArticlesCard = async () => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT a.id, a.slug, a.img, a.title, a.created_at, a.description, b.name AS author_name 
         FROM articles AS a
         JOIN authors AS b ON a.id_author = b.id
         WHERE a.status = 'publish' 
         ORDER BY a.id DESC
         LIMIT 5`
    );
    return rows;
};

/**
 * Mengambil semua artikel publik (Status 'publish').
 * Digunakan untuk halaman arsip blog.
 */
export const fetchAllArticlesCard = async () => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT a.id, a.slug, a.img, a.title, a.created_at, a.description, b.name AS author_name 
         FROM articles AS a
         JOIN authors AS b ON a.id_author = b.id
         WHERE a.status = 'publish' 
         ORDER BY a.id DESC`
    );
    return rows;
};

/**
 * Mengambil detail satu artikel berdasarkan slug.
 * @param slug String unik URL artikel
 */
export const fetchArticleBySlug = async (slug: string) => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT a.id, a.slug, a.img, a.title, a.created_at, a.content, b.name AS author_name 
         FROM articles AS a
         JOIN authors AS b ON a.id_author = b.id
         WHERE a.slug = ? AND a.status = 'publish'`, 
        [slug]
    );
    return rows; // Mengembalikan array (RowDataPacket[])
};

// ==========================================
// BAGIAN 2: ADMIN (CRUD & Management)
// ==========================================

/**
 * Mengambil SEMUA artikel untuk admin dashboard.
 * Termasuk yang statusnya 'draft' atau 'pending'.
 */
export const getAdminArticles = async () => {
    const [rows] = await pool.execute(
        `SELECT a.*, b.name as author_name 
         FROM articles AS a
         JOIN authors AS b ON a.id_author = b.id
         ORDER BY a.created_at DESC`
    );
    return rows;
};

/**
 * Mengambil detail artikel berdasarkan ID (untuk form edit).
 */
export const getArticleById = async (id: number) => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM articles WHERE id = ?`, [id]
    );
    return rows[0];
};

/**
 * Membuat data awal artikel (Insert Teks Dasar).
 * Slug sementara dibuat otomatis untuk menghindari error duplikasi unique key.
 */
export const createArticleInitial = async (data: ArticleData) => {
    // Generate slug sementara yang dijamin unik
    const tempSlug = `temp-${Date.now()}-${Math.round(Math.random() * 1000)}`;

    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO articles 
            (id_author, title, status, password, content, description, created_at, img, slug) 
         VALUES 
            (?, ?, ?, ?, ?, ?, ?, 'default.png', ?)`,
        [
            data.id_author, 
            data.title, 
            data.status, 
            data.password || null, 
            data.content, 
            data.description || null, 
            data.created_at, 
            tempSlug
        ]
    );
    
    return result.insertId;
};

/**
 * Update tahap kedua: Menyimpan Slug Final dan Nama File Gambar (jika ada).
 */
export const updateArticleFileAndSlug = async (id: number, slug: string, imgFilename?: string) => {
    let sql = `UPDATE articles SET slug = ?`;
    const params: (string|number)[] = [slug];

    if (imgFilename) {
        sql += `, img = ?`;
        params.push(imgFilename);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    return await pool.execute(sql, params);
};

/**
 * Update informasi teks artikel (Judul, Konten, dll).
 */
export const updateArticleInfo = async (id: number, data: ArticleData) => {
    return await pool.execute(
        `UPDATE articles SET id_author=?, title=?, status=?, password=?, content=?, description=? WHERE id=?`,
        [
            data.id_author, 
            data.title, 
            data.status, 
            data.password, 
            data.content, 
            data.description, 
            id
        ]
    );
};

/**
 * Menghapus artikel permanen dari database.
 */
export const deleteArticle = async (id: number) => {
    return await pool.execute('DELETE FROM articles WHERE id = ?', [id]);
};