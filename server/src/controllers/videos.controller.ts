// server/src/controllers/videos.controller.ts

import type { Request, Response } from "express";
import * as videoService from '../services/video.service';


export const getAllVideos = async (req: Request, res: Response) => {
    try {
        const videos = await videoService.fetchAllVideos();
        res.json(videos);
    } catch (error) {
        console.error("Error in getAllVideos: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}