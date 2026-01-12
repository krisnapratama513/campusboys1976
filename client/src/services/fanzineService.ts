// client/src/service/fanzineService.ts

/**
 * ==============================================================================
 * FANZINE SERVICE
 * ==============================================================================
 * Mengelola API Fanzine.
 * - Public: Read List & Detail Slug
 * - Admin: Create, Update, Delete (Wajib Token)
 */

import type { FanzineType } from "../types/fanzine.types";
import { API_BASE_URL } from "../config/api";

// Helper: Header Auth
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Authorization': `Bearer ${token}`
    };
};

// --- PUBLIC ---

export const getAllFanzine = async (): Promise<FanzineType[]> => {
    const response = await fetch(`${API_BASE_URL}/fanzines`);
    if(!response.ok) throw new Error('Gagal mengambil data getAllFanzine');
    
    const result = await response.json();
    return result.data; 
};

export const getFanzineBySlug = async (slug: string): Promise<FanzineType> => {
    const response = await fetch(`${API_BASE_URL}/fanzines/${slug}`);
    if(!response.ok) throw new Error('Gagal mengambil detail fanzine');

    const result = await response.json();
    return result.data;
};

// --- ADMIN (PROTECTED) ---

export const getFanzineById = async (id: string | number): Promise<FanzineType> => {
    const response = await fetch(`${API_BASE_URL}/fanzines/detail/${id}`, {
        headers: getAuthHeaders() // [PENTING]
    });
    if (!response.ok) throw new Error('Gagal mengambil data fanzine');
    const result = await response.json();
    return result.data;
};

export const createFanzine = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/fanzines`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders() // [PENTING] Sisipkan token
            // Content-Type jangan di-set manual saat pakai FormData!
        },
        body: formData, 
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal membuat fanzine');
    return result;
};

export const updateFanzine = async (id: string | number, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/fanzines/${id}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeaders() // [PENTING]
        },
        body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal update fanzine');
    return result;
};

export const deleteFanzine = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/fanzines/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders() // [PENTING]
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menghapus fanzine');
    return result;
};