// server/src/controllers/chapters.controller.ts

import { Request, Response } from 'express';
import * as chapterService from '../services/chapter.service';
import fs from 'fs';
import path from 'path';

// Folder penyimpanan
const targetDir = path.join(__dirname, '../../../client/public/chapters');

// Helper hapus file (kecuali default.png)
const deleteFile = (filename: string) => {
    if (filename && filename !== 'default.png') {
        const filePath = path.join(targetDir, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
};

export const getChapters = async (req: Request, res: Response) => {
    try {
        const data = await chapterService.getAllChapters();
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getChapterImages = async (req: Request, res: Response) => {
    try {
        const data = await chapterService.getAllImageChapters();
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getChapterById = async (req: Request, res: Response) => {
    try {
        const data = await chapterService.getChapterById(Number(req.params.id));
        if (!data) return res.status(404).json({ message: 'Chapter tidak ditemukan' });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const createChapter = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const img = req.file ? req.file.filename : 'default.png';

        if (!name) return res.status(400).json({ message: 'Nama Chapter wajib diisi' });

        await chapterService.createChapter(name, description || '', img);
        res.status(201).json({ message: 'Chapter berhasil dibuat' });
    } catch (err: any) {
        if (req.file) deleteFile(req.file.filename); // Cleanup jika error
        res.status(500).json({ message: err.message });
    }
};

export const updateChapter = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, description } = req.body;
        
        const oldData = await chapterService.getChapterById(id);
        if (!oldData) return res.status(404).json({ message: 'Chapter tidak ditemukan' });

        let newImg = undefined;
        if (req.file) {
            newImg = req.file.filename;
            // Hapus gambar lama jika ada dan bukan default
            if (oldData.img) deleteFile(oldData.img);
        }

        await chapterService.updateChapter(id, name, description, newImg);
        res.json({ message: 'Chapter berhasil diupdate' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteChapter = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const oldData = await chapterService.getChapterById(id);
        
        if (oldData) {
            // Hapus file fisik
            if (oldData.img) deleteFile(oldData.img);
            // Hapus data DB
            await chapterService.deleteChapter(id);
            res.json({ message: 'Chapter berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'Chapter tidak ditemukan' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};