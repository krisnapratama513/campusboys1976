// server/src/routes/chapter.routes.ts

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
    getChapters, getChapterById, createChapter, updateChapter, deleteChapter, getChapterImages 
} from '../controllers/chapter.controller';

const router = Router();

// Config Upload
const uploadDir = path.join(__dirname, '../../../client/public/chapters');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
router.get('/', getChapters);
// Get Images Only (TARUH INI DI ATAS /:id)
router.get('/images', getChapterImages);

router.get('/:id', getChapterById);
router.post('/', upload.single('img'), createChapter);
router.put('/:id', upload.single('img'), updateChapter);
router.delete('/:id', deleteChapter);

export default router;