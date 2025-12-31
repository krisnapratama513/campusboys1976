// server/src/controllers/albums.controller.ts

import type { Request, Response } from 'express';
import * as albumService from '../services/album.service'; // Import Service

export const getPublicAlbums = async (req: Request, res: Response) => {
    try {
        const albums = await albumService.fetchAllPublishedAlbums();
        res.json(albums);
    } catch (error) {
        console.error('Error in getPublicAlbums:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPublicAlbumById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    try {
        const album = await albumService.fetchAlbumDetailById(id);

        if (!album) {
            return res.status(404).json({ error: 'Album not found' });
        }

        res.json(album);
    } catch (error) {
        console.error('Error in getPublicAlbumById:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};