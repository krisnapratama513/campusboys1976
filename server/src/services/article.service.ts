// server/src/service/article.service.ts

import { pool } from '../config/database';
import type { RowDataPacket } from 'mysql2';

export const fetchRecentArticlesCard = async () => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
                a.id,
                a.slug,
                a.img,
                a.title,
                a.created_at,
                a.description,
                b.name AS author_name 
            FROM articles AS a
            JOIN authors AS b ON a.id_author = b.id
            ORDER BY a.id DESC
            LIMIT 5`
    );
    return rows;
};

export const fetchAllArticlesCard = async () => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
                a.id,
                a.slug,
                a.img,
                a.title,
                a.created_at,
                a.description,
                b.name AS author_name 
            FROM articles AS a
            JOIN authors AS b ON a.id_author = b.id
            ORDER BY a.id DESC`
    );
    return rows;
};

export const fetchArticleBySlug = async (slug: string) => {
    if(!slug){
        return null;
    }
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
                a.id,
                a.slug,
                a.img,
                a.title,
                a.created_at,
                a.content,
                b.name AS author_name 
            FROM articles AS a
            JOIN authors AS b ON a.id_author = b.id
            WHERE a.slug = ?`, // Placeholder untuk slug
            [slug]
    );
    return rows;
};