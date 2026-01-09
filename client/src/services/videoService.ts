// client/src/service/videoService.ts

import { API_BASE_URL } from '../config/api';
import type { Video } from '../types/video.types';

// --- PUBLIC ---
export const getPublicVideos = async (): Promise<Video[]> => {
    const res = await fetch(`${API_BASE_URL}/videos/public`);
    if (!res.ok) throw new Error('Gagal memuat video');
    return res.json();
};

// --- ADMIN ---
export const getAdminVideos = async (): Promise<{ data: Video[] }> => {
    const res = await fetch(`${API_BASE_URL}/videos`);
    if (!res.ok) throw new Error('Gagal memuat data video');
    return res.json();
};

export const createVideo = async (data: any) => {
    // Backend mengharapkan { title, url, description, is_active }
    const res = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal tambah video');
    return result;
};

export const updateVideo = async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal update video');
    return result;
};

export const deleteVideo = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE'
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal hapus video');
    return result;
};

export const getVideoById = async (id: string | number) => {
    const res = await fetch(`${API_BASE_URL}/videos/${id}`);
    if (!res.ok) throw new Error('Gagal mengambil detail video');
    const result = await res.json();
    return result.data; // Backend mengirim { data: object }
};