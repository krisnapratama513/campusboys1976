// server/src/routes/article.routes.ts
import { Router } from "express";
import { getRecentArticlesCard, getAllArticlesCard, getArticleBySlug, get3RecentArticlesCard } from "../controllers/articles.controller";

const router = Router();
router.get('/', getAllArticlesCard);
router.get('/recent', getRecentArticlesCard);
router.get('/recent3', get3RecentArticlesCard);
router.get('/:slug', getArticleBySlug);

export default router;
