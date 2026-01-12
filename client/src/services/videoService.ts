/**
 * ==============================================================================
 * VIDEO SERVICE
 * ==============================================================================
 * Mengelola API Video. Memisahkan endpoint Public dan Admin (Protected).
 */

import { API_BASE_URL } from '../config/api';
import type { Video } from '../types/video.types';

// Helper: Header Auth
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// --- PUBLIC (Tanpa Token) ---
export const getPublicVideos = async (): Promise<Video[]> => {
    const res = await fetch(`${API_BASE_URL}/videos/public`);
    if (!res.ok) throw new Error('Gagal memuat video public');
    return res.json();
};

// --- ADMIN (Wajib Token) ---

export const getAdminVideos = async (): Promise<{ data: Video[] }> => {
    const res = await fetch(`${API_BASE_URL}/videos`, {
        headers: getAuthHeaders() // [PENTING]
    });
    if (!res.ok) throw new Error('Gagal memuat data video admin');
    return res.json();
};

export const createVideo = async (data: any) => {
    // Data: { title, url, description, is_active }
    const res = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: getAuthHeaders(), // [PENTING]
        body: JSON.stringify(data)
    });
    
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal tambah video');
    return result;
};

export const updateVideo = async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // [PENTING]
        body: JSON.stringify(data)
    });
    
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal update video');
    return result;
};

export const deleteVideo = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE',
        // Delete biasanya tidak butuh Content-Type, tapi butuh Auth
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
        }
    });
    
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal hapus video');
    return result;
};

// Untuk Form Edit
export const getVideoById = async (id: string | number) => {
    const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
        headers: getAuthHeaders() // [PENTING] karena endpoint detail ini dilindungi admin
    });
    if (!res.ok) throw new Error('Gagal mengambil detail video');
    const result = await res.json();
    return result.data; 
};