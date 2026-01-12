// client/src/services/authorService.ts

/**
 * ==============================================================================
 * AUTHOR SERVICE (CLIENT)
 * ==============================================================================
 * Mengelola komunikasi API untuk modul Author.
 * Menangani CRUD Author dengan header otentikasi.
 */

import { API_BASE_URL } from '../config/api';

/**
 * Interface data Author yang diterima dari API.
 * Mencakup data statistik (total artikel/fanzine) untuk dashboard.
 */
export interface Author {
    id: number;
    name: string;
    total_articles?: number;
    total_fanzine?: number;
}

/**
 * Helper internal: Ambil token dari LocalStorage untuk Header Authorization.
 * Diperlukan untuk endpoint Create, Update, dan Delete.
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

/**
 * Mengambil daftar semua author.
 * Endpoint ini Public (tidak perlu token), kecuali jika diubah di backend.
 */
export const getAllAuthors = async (): Promise<Author[]> => {
    const response = await fetch(`${API_BASE_URL}/authors`);
    
    if (!response.ok) {
        throw new Error('Gagal mengambil data authors');
    }
    
    const result = await response.json();
    return result.data; // Backend return structure: { message, data: [...] }
};

/**
 * Mengambil detail satu author berdasarkan ID.
 * Digunakan untuk pre-fill form edit.
 */
export const getAuthorById = async (id: number | string): Promise<Author> => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}`);
    
    if (!response.ok) {
        throw new Error('Gagal mengambil detail author');
    }
    
    const result = await response.json();
    return result.data;
};

/**
 * Membuat Author Baru.
 * Protected: Memerlukan Token.
 */
export const createAuthor = async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/authors`, {
        method: 'POST',
        headers: getAuthHeaders(), // [PENTING] Pakai helper auth
        body: JSON.stringify({ name }),
    });

    const result = await response.json();
    
    if (!response.ok) {
        // Menangkap pesan error spesifik dari backend (misal: "Nama author sudah terdaftar")
        throw new Error(result.message || 'Gagal menambah author');
    }
    
    return result;
};

/**
 * Update Data Author.
 * Protected: Memerlukan Token.
 */
export const updateAuthor = async (id: number | string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // [PENTING] Pakai helper auth
        body: JSON.stringify({ name }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Gagal update author');
    }
    
    return result;
};

/**
 * Delete Author.
 * Protected: Memerlukan Token.
 */
export const deleteAuthor = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(), // [PENTING] Pakai helper auth (meski tanpa body, header auth tetap perlu)
    });

    const result = await response.json();

    if (!response.ok) {
        // Menangkap error constraint (misal: "Gagal! Author ini tidak bisa dihapus...")
        throw new Error(result.message || 'Gagal menghapus author');
    }
    
    return result;
};