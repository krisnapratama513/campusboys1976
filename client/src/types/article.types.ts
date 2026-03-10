// client/src/types/article.types.ts

/**
 * ==============================================================================
 * ARTICLE TYPES
 * ==============================================================================
 * Definisi tipe data untuk modul Artikel di sisi Frontend.
 */

/**
 * Tipe data ringkas untuk Card Artikel (Halaman Depan/List).
 * Sesuai dengan data yang dikirim oleh endpoint '/articles/recent' atau '/articles/all'.
 */
export type ApiArticleCard = {
    id: number;
    slug: string;
    img: string;
    title: string;
    created_at: string; // ISO Date String
    description: string;
    author_name: string;
};

/**
 * Props untuk komponen UI <ArticleCard />.
 */
export type ArticleCardProps = {
    href: string;
    imgFilename: string;
    author: string;
    date: string;
    title: string;
    description: string;
};

/**
 * Tipe data lengkap untuk Detail Artikel & Form Admin.
 * Mencakup field sensitif seperti password dan status yang hanya dibutuhkan Admin.
 */
export type FullArticleDetail = {
    id: number;
    
    // Foreign Key Author (Penting untuk edit)
    id_author: number; 
    
    // Nama author (opsional karena di form edit kita mungkin cuma butuh ID)
    author_name?: string; 
    
    title: string;
    slug: string;
    img: string;
    content: string; // HTML Content dari Rich Text Editor
    description: string;
    
    // Status publikasi
    status: 'publish' | 'pending'; 
    
    // Password proteksi artikel (Opsional)
    password?: string; 
    
    created_at: string;
};

// [TAMBAHAN] Tipe untuk Metadata Pagination
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

// [TAMBAHAN] Tipe untuk Response getAllArticlesCard dengan Pagination
export interface PublicArticlesResponse {
    message: string;
    data: ApiArticleCard[];
    pagination: PaginationMeta;
}