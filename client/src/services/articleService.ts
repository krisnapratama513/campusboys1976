// client/src/service/articleService

import type { ApiArticleCard, FullArticleDetail } from '../types/article.types';
import { API_BASE_URL } from '../config/api';

// router.get('/', getAllArticlesCard); 
// router.get('/recent', getRecentArticlesCard);
// router.get('/:slug', getArticleBySlug);

export const getRecentArticlesCard = async (): Promise<ApiArticleCard[]> => {
    const response = await fetch(`${API_BASE_URL}/articles/recent`);
    if (!response.ok) throw new Error('Gagal mengambil data recent article card');
    return response.json();
};

export const getAllArticlesCard = async (): Promise<ApiArticleCard[]> => {
    const response = await fetch(`${API_BASE_URL}/articles`);
    if (!response.ok) throw new Error('Gagal mengambil data getAllArticlesCard');
    return response.json();
};

export const getArticleBySlug = async(slug: string): Promise<FullArticleDetail[]> => {
    const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
    if (!response.ok) throw new Error('Gagal mengambil data getArticleBySlug');
    return response.json();
}