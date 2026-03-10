// client/src/service/articleService

/**
 * ==============================================================================
 * ARTICLE SERVICE (CLIENT)
 * ==============================================================================
 * Mengelola komunikasi API untuk modul Artikel.
 * Memisahkan endpoint Public (Tanpa Token) dan Admin (Wajib Token).
 */

import type { ApiArticleCard, FullArticleDetail, PublicArticlesResponse } from '../types/article.types';
import { API_BASE_URL } from '../config/api';

/**
 * Helper internal: Ambil token dari LocalStorage untuk Header Authorization.
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Authorization': `Bearer ${token}`
    };
};

// ==========================================
// PUBLIC SERVICE (Read Only - No Token)
// ==========================================

/**
 * Mengambil 5 artikel terbaru untuk widget/homepage.
 */
export const getRecentArticlesCard = async (): Promise<ApiArticleCard[]> => {
    const response = await fetch(`${API_BASE_URL}/articles/recent`);
    if (!response.ok) throw new Error('Gagal mengambil data recent article');
    return response.json();
};

/**
 * Mengambil SEMUA artikel publik (Arsip Blog) dengan Pagination.
 * Endpoint server: /articles/all?page=x
 */
export const getAllArticlesCard = async (page: number = 1): Promise<PublicArticlesResponse> => {
    // PERBAIKAN: Tambahkan parameter query ?page=
    const response = await fetch(`${API_BASE_URL}/articles/all?page=${page}`);
    if (!response.ok) throw new Error('Gagal mengambil semua artikel');
    
    // Return langsung seluruh JSON (termasuk .data dan .pagination)
    return await response.json();
};

/**
 * Mengambil detail artikel berdasarkan Slug (untuk halaman baca).
 */
export const getArticleBySlug = async (slug: string): Promise<FullArticleDetail[]> => {
    const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
    if (!response.ok) throw new Error('Artikel tidak ditemukan');
    return response.json();
};

// ==========================================
// ADMIN SERVICE (Protected - Wajib Token)
// ==========================================

/**
 * Ambil data tabel dashboard admin.
 * Endpoint server: /articles/admin/list
 */
export const getAdminArticles = async (): Promise<FullArticleDetail[]> => {
    const response = await fetch(`${API_BASE_URL}/articles/admin/list`, {
        headers: { ...getAuthHeaders() } // WAJIB ADA TOKEN
    });
    
    if (!response.ok) throw new Error('Gagal mengambil data admin articles');
    const result = await response.json();
    return result.data; 
};

/**
 * Ambil detail by ID untuk mengisi Form Edit.
 * Endpoint server: /articles/admin/detail/:id
 */
export const getArticleById = async (id: string | number): Promise<FullArticleDetail> => {
    const response = await fetch(`${API_BASE_URL}/articles/admin/detail/${id}`, {
        headers: { ...getAuthHeaders() } // WAJIB ADA TOKEN
    });

    if (!response.ok) throw new Error('Gagal mengambil detail artikel edit');
    const result = await response.json();
    return result.data;
};

/**
 * Create Article Baru.
 * Menggunakan FormData (File Upload).
 */
export const createArticle = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
        method: 'POST',
        headers: {
            // Jangan set Content-Type manual untuk FormData
            ...getAuthHeaders() // WAJIB ADA TOKEN
        },
        body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || result.message || 'Gagal membuat artikel');
    }
    return result;
};

/**
 * Update Article.
 * Menggunakan FormData (File Upload).
 */
export const updateArticle = async (id: string | number, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeaders() // WAJIB ADA TOKEN
        },
        body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal update artikel');
    return result;
};

/**
 * Delete Article.
 * PERBAIKAN: Server menggunakan method POST ke endpoint '/delete/:id'
 * karena perlu menerima body (password konfirmasi).
 */
export const deleteArticle = async (id: number, confirm_password?: string) => {
    // Endpoint server: router.post('/delete/:id', ...)
    const response = await fetch(`${API_BASE_URL}/articles/delete/${id}`, {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders() // WAJIB ADA TOKEN
        },
        body: JSON.stringify({ confirm_password }) 
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menghapus artikel');
    return result;
};