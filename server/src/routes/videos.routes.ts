// server/src/routes/videos.routes.ts
import { Router } from 'express';
import { 
    getPublicVideos, 
    getAdminVideos, 
    getVideoById, 
    createVideo, 
    updateVideo, 
    deleteVideo 
} from '../controllers/video.controller';

const router = Router();

// Public Endpoint
router.get('/public', getPublicVideos);

// Admin Endpoints
router.get('/', getAdminVideos);
router.get('/:id', getVideoById);
router.post('/', createVideo); // Tidak butuh middleware upload
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

export default router;