// client/src/services/albumService.ts

import { API_BASE_URL } from '../config/api';
import type { Album } from '../types/album.types';

// [TAMBAHAN 1] Helper untuk Auth Header (Wajib untuk Admin)
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Authorization': `Bearer ${token}`
    };
};

// ==========================================
// BAGIAN 1: PUBLIC SERVICE (Untuk Pengunjung)
// ==========================================

export const getPublicAlbums = async (): Promise<Album[]> => {
    const response = await fetch(`${API_BASE_URL}/albums/public`);
    if (!response.ok) throw new Error('Gagal mengambil data album public');
    
    // [TAMBAHAN 2] Unwrapping data
    // Backend return { message: 'Success', data: [...] }
    const result = await response.json(); 
    return result.data; 
};

export const getPublicAlbumBySlug = async (slug: string): Promise<Album> => {
    const response = await fetch(`${API_BASE_URL}/albums/public/${slug}`);
    if (!response.ok) throw new Error('Gagal mengambil detail album public');
    
    const result = await response.json();
    return result.data;
};


// ==========================================
// BAGIAN 2: ADMIN SERVICE (Untuk Dashboard)
// ==========================================

// 1. Get List Admin
export const getAdminAlbums = async (): Promise<Album[]> => {
    const res = await fetch(`${API_BASE_URL}/albums`, {
        headers: getAuthHeaders() // [PENTING] Kirim Token
    });
    if (!res.ok) throw new Error('Gagal mengambil data album admin');
    
    const result = await res.json();
    return result.data; 
};

// 2. Get Detail By ID (Admin perlu fetch by ID untuk edit)
export const getAlbumById = async (id: string | number): Promise<Album> => {
    const res = await fetch(`${API_BASE_URL}/albums/${id}`, {
        headers: getAuthHeaders() // [PENTING]
    });
    if (!res.ok) throw new Error('Gagal mengambil detail album admin');
    
    const result = await res.json();
    return result.data;
};

// 3. Create
export const createAlbum = async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/albums`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders() // [PENTING]
            // Content-Type: browser otomatis set multipart/form-data
        },
        body: formData
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal membuat album');
    return result;
};

// 4. Update
export const updateAlbum = async (id: string | number, formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/albums/${id}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeaders() // [PENTING]
        },
        body: formData
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal update album');
    return result;
};

// 5. Delete Full
export const deleteAlbum = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/albums/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders() // [PENTING]
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal menghapus album');
    return result;
};

// 6. Delete Single Photo
export const deleteAlbumPhoto = async (photoId: number) => {
    const res = await fetch(`${API_BASE_URL}/albums/photo/${photoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders() // [PENTING]
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal menghapus foto');
    return result;
};