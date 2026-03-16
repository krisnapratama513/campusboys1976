// client/src/services/chapterService.ts

/**
 * ==============================================================================
 * CHAPTER SERVICE (CLIENT)
 * ==============================================================================
 * Mengelola komunikasi HTTP ke API Backend untuk modul Chapter.
 * Menggunakan Fetch API native.
 */

import { API_BASE_URL } from '../config/api';
import type { Chapter, ChapterImage } from '../types/chapter.types';

/**
 * Helper internal: Membuat object Header Authorization.
 * Mengambil token akses dari LocalStorage.
 * @returns Object header { Authorization: 'Bearer ...' }
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Authorization': `Bearer ${token}`
    };
};

/**
 * Mengambil daftar lengkap semua chapter.
 * Endpoint bersifat publik (tidak perlu login).
 * @returns Promise berisi array Chapter
 */
export const getChapters = async ({ signal }: { signal?: AbortSignal } = {}): Promise<Chapter[]> => {
    // Inject signal ke dalam konfigurasi fetch
    const res = await fetch(`${API_BASE_URL}/chapters`, { signal });
    
    if (!res.ok) throw new Error('Gagal mengambil data chapter');
    return res.json();
};

/**
 * Mengambil data ringan (hanya ID dan Gambar) chapter.
 * Biasanya digunakan untuk galeri atau dropdown agar hemat bandwidth.
 * @returns Promise berisi array ChapterImage
 */
export const getChapterImages = async ({ signal }: { signal?: AbortSignal } = {}): Promise<ChapterImage[]> => {
    const res = await fetch(`${API_BASE_URL}/chapters/images`, {signal});
    if (!res.ok) throw new Error('Gagal mengambil gambar chapter');
    return res.json();
};

/**
 * Mengambil detail satu chapter berdasarkan ID.
 * @param id ID Chapter yang dicari
 */
export const getChapterById = async (id: string | number): Promise<Chapter> => {
    const res = await fetch(`${API_BASE_URL}/chapters/${id}`);
    if (!res.ok) throw new Error('Gagal mengambil detail chapter');
    return res.json();
};

/**
 * Membuat Chapter baru.
 * Menggunakan FormData karena mendukung upload file.
 * Memerlukan token autentikasi (Admin/Superadmin).
 * * @param formData Object FormData berisi 'name', 'description', dan file 'img'
 */
export const createChapter = async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/chapters`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders() 
            // Catatan: Jangan set Content-Type manual untuk FormData, 
            // Browser akan otomatis mengatur boundary-nya.
        },
        body: formData,
    });
    
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal membuat chapter');
    return result;
};

/**
 * Memperbarui data Chapter.
 * Memerlukan token autentikasi.
 * * @param id ID Chapter yang akan diupdate
 * @param formData Data baru (bisa termasuk file gambar baru atau tidak)
 */
export const updateChapter = async (id: string | number, formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/chapters/${id}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeaders()
        },
        body: formData
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal update chapter');
    return result;
};

/**
 * Menghapus Chapter permanen.
 * Memerlukan token autentikasi.
 * * @param id ID Chapter yang akan dihapus
 */
export const deleteChapter = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/chapters/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal menghapus chapter');
    return result;
};