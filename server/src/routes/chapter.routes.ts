import { Router } from 'express';
// Pastikan ini singular (tanpa 's') dan tanpa '.js'
import { getAllChapters, getChapterList } from '../controllers/chapters.controller';

const router = Router();

// (Akan diakses via GET /api/chapters)
router.get('/', getAllChapters);

// (Akan diakses via GET /api/chapters/list)
router.get('/list', getChapterList);


export default router;