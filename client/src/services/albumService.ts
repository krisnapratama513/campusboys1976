// client/src/services/albumService.ts

import type { AlbumListItem, AlbumDetail } from '../types/album.types';
import { API_BASE_URL } from '../config/api';

export const getAlbums = async (): Promise<AlbumListItem[]> => {
    // Penggunaan menjadi lebih bersih:
    const response = await fetch(`${API_BASE_URL}/albums`); 
    
    if (!response.ok) throw new Error('Gagal mengambil data album');
    return response.json();
};

export const getAlbumById = async (id: string): Promise<AlbumDetail> => {
    const response = await fetch(`${API_BASE_URL}/albums/${id}`);
    
    if (!response.ok) throw new Error('Gagal mengambil detail album');
    return response.json();
};