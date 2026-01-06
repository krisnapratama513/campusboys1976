// client/src/service/articleService

import type { ApiArticleCard, FullArticleDetail } from '../types/article.types';
import { API_BASE_URL } from '../config/api';

// ==========================================
// PUBLIC SERVICE (Milik Anda Sebelumnya)
// ==========================================

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

export const getArticleBySlug = async (slug: string): Promise<FullArticleDetail[]> => {
    const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
    if (!response.ok) throw new Error('Gagal mengambil data getArticleBySlug');
    return response.json();
};

// ==========================================
// ADMIN SERVICE (CRUD BARU)
// ==========================================

// 1. Ambil Semua Data (Tabel Admin)
export const getAdminArticles = async (): Promise<FullArticleDetail[]> => {
    const response = await fetch(`${API_BASE_URL}/articles/admin/list`);
    if (!response.ok) throw new Error('Gagal mengambil data admin articles');
    const result = await response.json();
    return result.data; // Backend return { data: [...] }
};

// 2. Ambil Detail by ID (Untuk Form Edit)
export const getArticleById = async (id: string | number): Promise<FullArticleDetail> => {
    const response = await fetch(`${API_BASE_URL}/articles/detail/${id}`);
    if (!response.ok) throw new Error('Gagal mengambil detail artikel');
    const result = await response.json();
    return result.data;
};

// 3. Create Article (Pakai FormData)
export const createArticle = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
        method: 'POST',
        body: formData, // Browser otomatis set Content-Type: multipart/form-data
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Gagal membuat artikel');
    }
    return result;
};

// 4. Update Article
export const updateArticle = async (id: string | number, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PUT',
        body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal update artikel');
    return result;
};

// 5. Delete Article (Butuh Confirm Password)
export const deleteArticle = async (id: number, confirm_password?: string) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm_password }) // Kirim password via body
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menghapus artikel');
    return result;
};