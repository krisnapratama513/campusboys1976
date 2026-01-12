/**
 * ==============================================================================
 * VIDEO CONTROLLER
 * ==============================================================================
 * Menangani request HTTP untuk Video.
 * Termasuk logika ekstraksi ID YouTube dari URL lengkap.
 */

import { Request, Response } from 'express';
import * as videoService from '../services/video.service';

/**
 * Helper: Ekstrak ID YouTube dari berbagai format URL.
 * Support format:
 * - youtube.com/watch?v=ID
 * - youtu.be/ID
 * - youtube.com/embed/ID
 */
const extractYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    // YouTube ID standar panjangnya 11 karakter
    if (match && match[2] && match[2].length === 11) {
        return match[2];
    }
    
    // Jika user memang memasukkan ID saja (bukan URL), kembalikan apa adanya
    if (url.length === 11) return url;

    return null; // Gagal ekstrak
};

/**
 * GET Public Videos
 */
export const getPublicVideos = async (req: Request, res: Response) => {
    try {
        const videos = await videoService.getPublicVideos();
        res.json(videos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET Admin List (All Videos)
 */
export const getAdminVideos = async (req: Request, res: Response) => {
    try {
        const videos = await videoService.getAllVideos();
        res.json({ data: videos });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET Detail Video
 */
export const getVideoById = async (req: Request, res: Response) => {
    try {
        const video = await videoService.getVideoById(Number(req.params.id));
        if (!video) return res.status(404).json({ message: 'Video tidak ditemukan' });
        res.json({ data: video });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * CREATE Video
 */
export const createVideo = async (req: Request, res: Response) => {
    try {
        const { title, url, description, is_active } = req.body;

        if (!title || !url) {
            return res.status(400).json({ message: 'Judul dan URL YouTube wajib diisi' });
        }

        const youtube_id = extractYouTubeID(url);
        if (!youtube_id) {
            return res.status(400).json({ message: 'Format URL YouTube tidak valid' });
        }

        const newId = await videoService.createVideo({
            title,
            youtube_id,
            description: description || '',
            is_active: is_active ? 1 : 0 
        });

        res.status(201).json({ message: 'Video berhasil ditambahkan', data: { id: newId } });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Video ini sudah ada di database!' });
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * UPDATE Video
 */
export const updateVideo = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, url, description, is_active } = req.body;

        // Cek URL: Jika user tidak ganti URL, pakai yang lama (tapi di sini kita ekstrak ulang aja biar aman)
        const youtube_id = extractYouTubeID(url);
        if (!youtube_id) {
            return res.status(400).json({ message: 'Format URL YouTube tidak valid' });
        }

        await videoService.updateVideo(id, {
            title,
            youtube_id,
            description: description || '',
            is_active: Number(is_active) 
        });

        res.json({ message: 'Video berhasil diupdate' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * DELETE Video
 */
export const deleteVideo = async (req: Request, res: Response) => {
    try {
        await videoService.deleteVideo(Number(req.params.id));
        res.json({ message: 'Video berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};