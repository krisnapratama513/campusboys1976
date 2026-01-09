// server/src/controllers/videos.controller.ts

import { Request, Response } from 'express';
import * as videoService from '../services/video.service';

// Helper: Ekstrak ID dari berbagai format link YouTube
const extractYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    // PERBAIKAN:
    // Gunakan Optional Chaining (?.) untuk mengecek panjangnya aman
    // Logikanya: Jika match ada, DAN capture group ke-2 ada, DAN panjangnya 11 char -> Return ID
    if (match && match[2] && match[2].length === 11) {
        return match[2];
    }

    return url; 
};

// --- PUBLIC ---
export const getPublicVideos = async (req: Request, res: Response) => {
    try {
        const videos = await videoService.getPublicVideos();
        res.json(videos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// --- ADMIN ---
export const getAdminVideos = async (req: Request, res: Response) => {
    try {
        const videos = await videoService.getAllVideos();
        res.json({ data: videos });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getVideoById = async (req: Request, res: Response) => {
    try {
        const video = await videoService.getVideoById(Number(req.params.id));
        if (!video) return res.status(404).json({ message: 'Video tidak ditemukan' });
        res.json({ data: video });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createVideo = async (req: Request, res: Response) => {
    try {
        const { title, url, description, is_active } = req.body; // 'url' bisa Link atau ID

        if (!title || !url) return res.status(400).json({ message: 'Judul dan URL YouTube wajib diisi' });

        const youtube_id = extractYouTubeID(url);

        const newId = await videoService.createVideo({
            title,
            youtube_id,
            description: description || '',
            is_active: is_active ? 1 : 0 // Pastikan jadi number
        });

        res.status(201).json({ message: 'Video berhasil ditambahkan', data: { id: newId } });
    } catch (error: any) {
        // Handle error duplicate entry (kalau youtube_id sama)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Video ini sudah ada di database!' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const updateVideo = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, url, description, is_active } = req.body;

        const youtube_id = extractYouTubeID(url);

        await videoService.updateVideo(id, {
            title,
            youtube_id,
            description: description || '',
            is_active: Number(is_active) // Konversi ke number (takutnya string "1" dari frontend)
        });

        res.json({ message: 'Video berhasil diupdate' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteVideo = async (req: Request, res: Response) => {
    try {
        await videoService.deleteVideo(Number(req.params.id));
        res.json({ message: 'Video berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};