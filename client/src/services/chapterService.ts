// client/src/services/chapterService.ts

import type {ApiChapter} from '../types/chapter.types';
import { API_BASE_URL } from '../config/api';

export const getAllChapters = async (): Promise<ApiChapter[]> => {
    const response = await fetch(`${API_BASE_URL}/chapters`);
    if (!response.ok) throw new Error('Gagal mengambil data chapter');
    return response.json();
};

export const getChapterList = async (): Promise<ApiChapter[]> => {
    const response = await fetch(`${API_BASE_URL}/chapters/list`);
    if (!response.ok) throw new Error('Gagal mengambil data chapter/list')
    return response.json();
};