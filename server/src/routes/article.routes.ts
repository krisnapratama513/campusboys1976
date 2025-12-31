// server/src/routes/article.routes.ts
import { Router } from "express";
import { getRecentArticlesCard, getAllArticlesCard, getArticleBySlug } from "../controllers/articles.controller";

const router = Router();
router.get('/', getAllArticlesCard);
router.get('/recent', getRecentArticlesCard);
router.get('/:slug', getArticleBySlug);

export default router;
