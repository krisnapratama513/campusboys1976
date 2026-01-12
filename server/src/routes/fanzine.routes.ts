// server/src/routes/fanzine.routes.ts

/**
 * ==============================================================================
 * FANZINE ROUTES
 * ==============================================================================
 * Endpoint manajemen Fanzine (Majalah Digital).
 * Menggunakan middleware 'authenticateToken' dan Role 'CAN_MANAGE_EDITORIAL'.
 */

import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { 
    createFanzine, getAllFanzines, 
    updateFanzine, getFanzineById, getFanzineBySlug, deleteFanzine
} from "../controllers/fanzine.controller";

// Security
import { authenticateToken, requireRole } from "../middlewares/auth.middleware";
import { PERMISSIONS } from "../config/permissions";

// --- CONFIG MULTER (TEMP STORAGE) ---
// Kita simpan sementara di folder uploads/temp sebelum diproses controller
const tempDir = path.join(__dirname, '../../uploads/temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, tempDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Limit 50MB (karena PDF bisa besar)
});

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/', getAllFanzines);
router.get('/:slug', getFanzineBySlug); // Detail Public by Slug

// --- PROTECTED ROUTES (EDITOR & SUPERADMIN) ---
// Note: Middleware 'upload.fields' menangani Cover & PDF sekaligus
const fanzineUpload = upload.fields([
    { name: 'cover', maxCount: 1 }, 
    { name: 'pdf', maxCount: 1 }
]);

router.post(
    '/', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL),
    fanzineUpload, 
    createFanzine
);

router.get(
    '/detail/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL), 
    getFanzineById // Untuk Form Edit
);

router.put(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL),
    fanzineUpload, 
    updateFanzine
);

router.delete(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL), 
    deleteFanzine
);

export default router;