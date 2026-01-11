// client/src/services/chapterService.ts

import { API_BASE_URL } from '../config/api';
import type { Chapter, ChapterImage } from '../types/chapter.types';

// 1. Get All Chapters (Full Data)
export const getChapters = async (): Promise<Chapter[]> => {
    const res = await fetch(`${API_BASE_URL}/chapters`);
    if (!res.ok) throw new Error('Gagal mengambil data chapter');
    return res.json();
};

// 2. Get Chapter Images Only (Ringan, hanya ID & Img)
export const getChapterImages = async (): Promise<ChapterImage[]> => {
    const res = await fetch(`${API_BASE_URL}/chapters/images`);
    if (!res.ok) throw new Error('Gagal mengambil gambar chapter');
    return res.json();
};

// 3. Get Detail By ID
export const getChapterById = async (id: string | number): Promise<Chapter> => {
    const res = await fetch(`${API_BASE_URL}/chapters/${id}`);
    if (!res.ok) throw new Error('Gagal mengambil detail chapter');
    return res.json();
};

// 4. Create (Pakai FormData karena ada file)
export const createChapter = async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/chapters`, {
        method: 'POST',
        body: formData,
        // Header 'Content-Type' jangan diset manual saat pakai FormData, 
        // browser akan otomatis menambahkannya beserta boundary.
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal membuat chapter');
    return result;
};

// 5. Update (Pakai FormData)
export const updateChapter = async (id: string | number, formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/chapters/${id}`, {
        method: 'PUT',
        body: formData
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal update chapter');
    return result;
};

// 6. Delete
export const deleteChapter = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/chapters/${id}`, {
        method: 'DELETE'
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal menghapus chapter');
    return result;
};