// server/src/controllers/chapters.controller.ts

import type { Request, Response } from 'express';
import * as chapterService from '../services/chapter.service'; 


export const getAllChapters = async (req: Request, res: Response) => {
    try {
        const chapters = await chapterService.fetchAllChapters();
        res.json(chapters);

    } catch (error) {
        console.error("Error saat fetchAllChapters: ", error);
        res.status(500).json({ message: "Gagal mengambil data chapter" });
    }
};

export const getChapterList = async (req: Request, res: Response) => {
    try {
        const chapterList = await chapterService.fetchChapterList();
        
        res.json(chapterList);

    } catch (error){
        console.error("Error saat fetchChapterList: ", error);
        res.status(500).json({ message: "Gagal mengambil data list chapter" });
    }
};