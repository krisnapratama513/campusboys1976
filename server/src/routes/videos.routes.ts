// server/src/routes/videos.routes.ts
import { Router } from "express";
import { getAllVideos } from "../controllers/videos.controller";

const router = Router();
router.get('/', getAllVideos);

export default router;