// server/src/routes/fanzine.routes.ts

import { Router } from "express";
import { upload } from "../config/upload";
import { 
    createFanzine, getAllFanzines, 
    updateFanzine, getFanzineById, getFanzineBySlug 
} from "../controllers/fanzine.controller";

// deleteFanzine

const router = Router();
router.get('/' ,getAllFanzines);
// GET by ID (Untuk Edit Form) - Taruh SEBELUM /:slug agar tidak tabrakan jika slug berupa angka
router.get('/detail/:id', getFanzineById); 

// PUT Update
router.put('/:id', upload.fields([
    { name: 'cover', maxCount: 1 }, 
    { name: 'pdf', maxCount: 1 }
]), updateFanzine);
router.get('/:slug', getFanzineBySlug);

router.post('/', upload.fields([
    { name: 'cover', maxCount: 1 }, 
    { name: 'pdf', maxCount: 1 }
]), createFanzine);

export default router;