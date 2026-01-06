import { pool } from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

// ==========================================
// BAGIAN 1: PUBLIC (Untuk Pengunjung)
// ==========================================

export const fetchRecentArticlesCard = async () => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT a.id, a.slug, a.img, a.title, a.created_at, a.description, b.name AS author_name 
         FROM articles AS a
         JOIN authors AS b ON a.id_author = b.id
         WHERE a.status = 'publish'  -- BEST PRACTICE: Filter hanya yang publish
         ORDER BY a.id DESC
         LIMIT 5`
    );
    return rows;
};

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

export const fetchArticleBySlug = async (slug: string) => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT a.id, a.slug, a.img, a.title, a.created_at, a.content, b.name AS author_name 
         FROM articles AS a
         JOIN authors AS b ON a.id_author = b.id
         WHERE a.slug = ? AND a.status = 'publish'`, 
        [slug]
    );
    return rows; // Return array
};

// ==========================================
// BAGIAN 2: ADMIN (CRUD & Management)
// ==========================================

// 1. Get All for Admin (Termasuk Pending & Password untuk keperluan cek)
export const getAdminArticles = async () => {
    const [rows] = await pool.execute(
        `SELECT a.*, b.name as author_name 
         FROM articles AS a
         JOIN authors AS b ON a.id_author = b.id
         ORDER BY a.created_at DESC`
    );
    return rows;
};

// 2. Get By ID (Untuk Form Edit Admin)
export const getArticleById = async (id: number) => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM articles WHERE id = ?`, [id]
    );
    return rows[0];
};

// 3. Create Awal (Insert Text)
export const createArticleInitial = async (data: any) => {
    const { id_author, title, status, password, content, description, created_at } = data;
    
    // SOLUSI: Buat slug sementara yang unik
    // Format: temp-[timestamp]-[random] agar tidak mungkin duplicate error
    const tempSlug = `temp-${Date.now()}-${Math.round(Math.random() * 1000)}`;

    // TAMBAHKAN 'slug' KE DALAM QUERY INSERT
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO articles 
            (id_author, title, status, password, content, description, created_at, img, slug) 
         VALUES 
            (?, ?, ?, ?, ?, ?, ?, 'default.png', ?)`,
        [id_author, title, status, password, content, description, created_at, tempSlug]
    );
    
    return result.insertId;
};

// 4. Update File & Slug
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

// 5. Update Info Text
export const updateArticleInfo = async (id: number, data: any) => {
    const { id_author, title, status, password, content, description } = data;
    return await pool.execute(
        `UPDATE articles SET id_author=?, title=?, status=?, password=?, content=?, description=? WHERE id=?`,
        [id_author, title, status, password, content, description, id]
    );
};

// 6. Delete
export const deleteArticle = async (id: number) => {
    return await pool.execute('DELETE FROM articles WHERE id = ?', [id]);
};