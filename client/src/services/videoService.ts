// client/src/service/videoService.ts

import type {ApiVideo} from '../types/video.types';
import { API_BASE_URL } from '../config/api';

export const getAllVideos = async (): Promise<ApiVideo[]> => {
    const response = await fetch(`${API_BASE_URL}/videos`);

    if (!response.ok) throw new Error('Gagal mengambil data video');
    return response.json();
};