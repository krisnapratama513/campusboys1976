// server/src/routes/article.routes.ts
import { Router } from "express";
import { getRecentArticlesCard } from "../controllers/articles.controller";

const router = Router();
router.get('/recent', getRecentArticlesCard);

export default router;
