// server/src/routes/article.routes.ts
import { Router } from "express";
import { 
    getAllArticlesCard, 
    getRecentArticlesCard, 
    getArticleBySlug,
    // Admin Controllers
    getAdminArticlesList,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} from "../controllers/articles.controller";

import { uploadArticle } from "../config/articleUpload"; // Config Multer tadi

const router = Router();

// --- ROUTE ADMIN (Letakkan Paling Atas) ---
// Supaya tidak dianggap sebagai :slug

// Create
router.post('/', uploadArticle.single('img'), createArticle); 

// List Admin (Table View - includes pending)
router.get('/admin/list', getAdminArticlesList); 

// Detail By ID (Untuk Edit Form)
router.get('/detail/:id', getArticleById);

// Update By ID
router.put('/:id', uploadArticle.single('img'), updateArticle);

// Delete By ID
router.delete('/:id', deleteArticle);


// --- ROUTE PUBLIC ---

// Recent (Static Path)
router.get('/recent', getRecentArticlesCard); 

// Get All Public (Root)
router.get('/', getAllArticlesCard); 

// Detail By Slug (Dynamic Path - WAJIB PALING BAWAH)
// Karena ini menangkap string apapun. 
router.get('/:slug', getArticleBySlug);

export default router;
