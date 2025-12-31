// server/src/controllers/articles.controller.ts

import type { Request, Response } from 'express';
import * as articleService from '../services/article.service';

export const getRecentArticlesCard = async (req: Request, res: Response) => {
    try {
        const articles = await articleService.fetchRecentArticlesCard();
        res.json(articles);
    } catch (error) {
        console.error("Error getRecentArticlesCard: ", error);
        res.status(500).json({ message: "Gagal mengambil data recent articles" });
    }
};

export const getAllArticlesCard = async (req: Request, res: Response) => {
    try {
        const articles = await articleService.fetchAllArticlesCard();
        res.json(articles);
    } catch (error) {
        console.error("Error getAllArticlesCard: ", error);
        res.status(500).json({ message: "Gagal mengambil data all articles" });
    }
};

export const getArticleBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    try {
        // Validasi input tetap di controller
        if (!slug) {
            return res.status(400).json({ message: "Slug tidak ditemukan" });
        }

        const articles = await articleService.fetchArticleBySlug(slug);

        // Validasi apakah artikel ditemukan (array kosong atau tidak)
        // articles adalah RowDataPacket[]
        if (!articles || articles.length === 0) {
            return res.status(404).json({ message: "Artikel tidak ditemukan" });
        }

        res.json(articles); // Mengirim array, frontend biasanya ambil index [0]
    } catch (error) {
        console.error("Error getArticleBySlug: ", error);
        res.status(500).json({ message: "Gagal mengambil detail artikel" });
    }
};


