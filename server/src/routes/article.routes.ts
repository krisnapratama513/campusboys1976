// server/src/routes/article.routes.ts

/**
 * ==============================================================================
 * ARTICLE ROUTES
 * ==============================================================================
 * Definisi endpoint untuk modul Artikel.
 * Menggunakan Multer untuk upload gambar ke 'uploads/articles'.
 */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as articleController from '../controllers/articles.controller';

// Middleware Security
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { PERMISSIONS } from '../config/permissions';

const router = Router();

// --- KONFIGURASI UPLOAD (MULTER) ---
const uploadDir = path.join(__dirname, '../../uploads/articles');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Nama file sementara (akan direname di controller sesuai slug)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `temp-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan!'));
        }
    }
});


// --- PUBLIC ROUTES (Read Only) ---
router.get('/recent', articleController.getRecentArticlesCard);
router.get('/all', articleController.getAllArticlesCard);
router.get('/:slug', articleController.getArticleBySlug);


// --- ADMIN ROUTES (CRUD - Protected) ---

// 1. List Admin (Table)
router.get(
    '/admin/list', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL), 
    articleController.getAdminArticlesList
);

// 2. Detail by ID (Form Edit)
router.get(
    '/admin/detail/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL), 
    articleController.getArticleById
);

// 3. Create
router.post(
    '/', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL), 
    upload.single('img'), // 'img' adalah key di FormData
    articleController.createArticle
);

// 4. Update
router.put(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL), 
    upload.single('img'), 
    articleController.updateArticle
);

// 5. Delete
router.post(
    '/delete/:id', // Menggunakan POST karena mungkin mengirim body (password konfirmasi)
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_EDITORIAL), 
    articleController.deleteArticle
);

export default router;