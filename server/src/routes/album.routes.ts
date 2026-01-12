/**
 * ==============================================================================
 * ALBUM ROUTES
 * ==============================================================================
 * Endpoint manajemen Album Foto (Fanzine Gallery).
 * - Public: Akses Read Only
 * - Admin (Creative): Full CRUD dengan upload foto massal.
 */

import { Router } from "express";
import { uploadAlbum } from "../config/albumUpload";
import { 
    getAdminAlbums, 
    getAlbumById, 
    createAlbum, 
    updateAlbum, 
    deleteAlbum,
    deletePhoto,
    getPublicAlbums, 
    getPublicAlbumDetail 
} from "../controllers/album.controller";

// Security Middleware
import { authenticateToken, requireRole } from "../middlewares/auth.middleware";
import { PERMISSIONS } from "../config/permissions";

const router = Router();

// Konfigurasi Upload:
const uploadFields = uploadAlbum.fields([
    { name: 'cover', maxCount: 1 },    // 1 Cover Wajib
    { name: 'photos', maxCount: 50 }   // Hingga 50 Foto Gallery
]);

// --- PUBLIC ROUTES (No Auth) ---
router.get('/public', getPublicAlbums);           
router.get('/public/:slug', getPublicAlbumDetail); 

// --- ADMIN ROUTES (Protected) ---
// Hanya Role Creative, Editor, dan Superadmin yang boleh mengelola Album
const requireCreative = requireRole(PERMISSIONS.CAN_MANAGE_CREATIVE);

// Read Admin List (Termasuk Draft)
router.get(
    '/', 
    authenticateToken, 
    requireCreative, 
    getAdminAlbums
);

// Read Detail Admin (Untuk Form Edit)
router.get(
    '/:id', 
    authenticateToken, 
    requireCreative, 
    getAlbumById
);

// Create Album
router.post(
    '/', 
    authenticateToken, 
    requireCreative,
    uploadFields, 
    createAlbum
);

// Update Album
router.put(
    '/:id', 
    authenticateToken, 
    requireCreative,
    uploadFields, 
    updateAlbum
);

// Delete Album Full
router.delete(
    '/:id', 
    authenticateToken, 
    requireCreative, 
    deleteAlbum
);

// Delete Single Photo
router.delete(
    '/photo/:photoId', 
    authenticateToken, 
    requireCreative, 
    deletePhoto
);

export default router;