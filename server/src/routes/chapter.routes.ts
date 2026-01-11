// server/src/routes/chapter.routes.ts

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
    getChapters, getChapterById, createChapter, updateChapter, deleteChapter, getChapterImages 
} from '../controllers/chapter.controller';

// Import Middleware Keamanan
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { PERMISSIONS } from '../config/permissions';

const router = Router();

/**
 * ------------------------------------------------------------------------------
 * KONFIGURASI MULTER (UPLOAD)
 * ------------------------------------------------------------------------------
 */

// Arahkan ke folder server/uploads/chapters
const uploadDir = path.join(__dirname, '../../uploads/chapters');

// Buat folder otomatis jika belum ada
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        // Format nama file unik: timestamp-random.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter File (Opsional: Hanya gambar)
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

/**
 * ------------------------------------------------------------------------------
 * DEFINISI ROUTE
 * ------------------------------------------------------------------------------
 */

// PUBLIC ROUTES (Bisa diakses siapa saja)
router.get('/', getChapters);
router.get('/images', getChapterImages);
router.get('/:id', getChapterById);

// PROTECTED ROUTES (Hanya Admin yang boleh)
// Middleware: Cek Login -> Cek Role -> Proses Upload -> Controller
router.post(
    '/', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_CHAPTERS), 
    upload.single('img'), // 'img' harus sesuai dengan key FormData di Frontend
    createChapter
);

router.put(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_CHAPTERS), 
    upload.single('img'), 
    updateChapter
);

router.delete(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_CHAPTERS), 
    deleteChapter
);

export default router;