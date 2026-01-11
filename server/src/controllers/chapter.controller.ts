// server/src/controllers/chapters.controller.ts

import { Request, Response } from 'express';
import * as chapterService from '../services/chapter.service';
import fs from 'fs';
import path from 'path';

/**
 * KONFIGURASI PATH PENYIMPANAN
 * Menunjuk ke folder 'server/uploads/chapters'
 */
const targetDir = path.join(__dirname, '../../uploads/chapters');

/**
 * Helper: Menghapus file fisik dari server saat data dihapus/diupdate.
 * Mencegah file sampah menumpuk (Orphaned Files).
 * @param filename Nama file yang akan dihapus
 */
const deleteFile = (filename: string) => {
    if (filename && filename !== 'default.png') {
        const filePath = path.join(targetDir, filename);
        // Cek apakah file ada sebelum menghapus untuk menghindari error crash
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error(`[File System] Gagal menghapus file ${filename}:`, err);
            }
        }
    }
};

/**
 * GET /api/chapters
 * Mengambil semua chapter.
 */
export const getChapters = async (req: Request, res: Response) => {
    try {
        const data = await chapterService.getAllChapters();
        res.json(data);
    } catch (err: any) {
        console.error('[ChapterController] getChapters:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * GET /api/chapters/images
 * Mengambil list gambar saja.
 */
export const getChapterImages = async (req: Request, res: Response) => {
    try {
        const data = await chapterService.getAllImageChapters();
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET /api/chapters/:id
 * Mengambil detail satu chapter.
 */
export const getChapterById = async (req: Request, res: Response) => {
    try {
        const data = await chapterService.getChapterById(Number(req.params.id));
        if (!data) return res.status(404).json({ message: 'Chapter tidak ditemukan' });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * POST /api/chapters
 * Membuat chapter baru dengan upload gambar.
 */
export const createChapter = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        // Ambil filename dari Multer (req.file) atau pakai default
        const img = req.file ? req.file.filename : 'default.png';

        if (!name) {
            // Jika validasi gagal tapi file terlanjur terupload, hapus file tersebut
            if (req.file) deleteFile(req.file.filename);
            return res.status(400).json({ message: 'Nama Chapter wajib diisi' });
        }

        await chapterService.createChapter(name, description || '', img);
        res.status(201).json({ message: 'Chapter berhasil dibuat' });
    } catch (err: any) {
        // Cleanup file jika database error
        if (req.file) deleteFile(req.file.filename); 
        res.status(500).json({ message: err.message });
    }
};

/**
 * PUT /api/chapters/:id
 * Update chapter. Menangani logika penggantian gambar.
 */
export const updateChapter = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, description } = req.body;
        
        // 1. Ambil data lama untuk cek gambar lama
        const oldData = await chapterService.getChapterById(id);
        if (!oldData) {
            // Jika ID salah, dan user upload file, hapus file baru tersebut agar tidak jadi sampah
            if (req.file) deleteFile(req.file.filename);
            return res.status(404).json({ message: 'Chapter tidak ditemukan' });
        }

        let newImg = undefined;
        if (req.file) {
            newImg = req.file.filename;
            // 2. Hapus gambar LAMA jika user upload gambar BARU
            // Pastikan bukan default.png yang dihapus
            if (oldData.img) deleteFile(oldData.img);
        }

        await chapterService.updateChapter(id, name, description, newImg);
        res.json({ message: 'Chapter berhasil diupdate' });
    } catch (err: any) {
        // Cleanup jika error
        if (req.file) deleteFile(req.file.filename);
        res.status(500).json({ message: err.message });
    }
};

/**
 * DELETE /api/chapters/:id
 * Hapus data dan file gambar terkait.
 */
export const deleteChapter = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const oldData = await chapterService.getChapterById(id);
        
        if (oldData) {
            // 1. Hapus file fisik dulu
            if (oldData.img) deleteFile(oldData.img);
            // 2. Hapus data di database
            await chapterService.deleteChapter(id);
            res.json({ message: 'Chapter berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'Chapter tidak ditemukan' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};