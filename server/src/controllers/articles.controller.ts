// server/src/controllers/articles.controller.ts

import type { Request, Response } from 'express';
// import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../index';

export const getRecentArticlesCard = async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
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

        connection.release();
        res.json(rows);
    } catch (error) {
        console.error("Error saat query  getRecentArticlesCard: ", error);
        res.status(500).json({ message: "gagal mengambil data getRecentArticlesCard" });
    }
};



export const getAllArticlesCard = async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
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

        connection.release();
        res.json(rows);
    } catch (error) {
        console.error("Error saat query  getAllArticlesCard: ", error);
        res.status(500).json({ message: "gagal mengambil data getAllArticlesCard" });
    }
};


export const getArticleBySlug = async (req: Request, res: Response) => {
    try {
        // 1. Ambil slug dari request (misalnya dari req.params)
        const { slug } = req.params; 

        // Pastikan slug ada
        if (!slug) {
            return res.status(400).json({ message: "Slug tidak ditemukan dalam request." });
        }

        const connection = await pool.getConnection();

        // 2. Gunakan placeholder (?) untuk nilai slug
        const [rows] = await connection.execute(
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
            [slug] // Nilai yang akan menggantikan placeholder
        );
        connection.release();
        res.json(rows); 

    } catch (error) {
        console.error("Error saat query getArticleBySlug: ", error);
        res.status(500).json({ message: "Gagal mengambil data artikel." });
    }
};


