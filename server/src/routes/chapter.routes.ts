import { Router } from 'express';
// Pastikan ini singular (tanpa 's') dan tanpa '.js'
import { getAllChapters } from '../controllers/chapters.controller';

const router = Router();
router.get('/', getAllChapters);
export default router;