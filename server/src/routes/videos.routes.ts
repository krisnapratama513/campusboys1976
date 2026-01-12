// server/src/routes/videos.routes.ts

/**
 * ==============================================================================
 * VIDEO ROUTES
 * ==============================================================================
 * Definisi endpoint untuk modul Video.
 * Endpoint Write (POST, PUT, DELETE) dilindungi middleware.
 */

import { Router } from 'express';
import { 
    getPublicVideos, 
    getAdminVideos, 
    getVideoById, 
    createVideo, 
    updateVideo, 
    deleteVideo 
} from '../controllers/video.controller';

// Security Middleware
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { PERMISSIONS } from '../config/permissions';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/public', getPublicVideos);


// --- ADMIN ROUTES (Protected) ---
// Dashboard Admin Video List
router.get(
    '/', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_CREATIVE), // Creative/Editor/Superadmin
    getAdminVideos
);

router.get(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_CREATIVE), 
    getVideoById
);

router.post(
    '/', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_CREATIVE), 
    createVideo
);

router.put(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_CREATIVE), 
    updateVideo
);

router.delete(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_CREATIVE), 
    deleteVideo
);

export default router;