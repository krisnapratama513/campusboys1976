// src/types/album.types.ts

// 1. Tipe untuk satu baris Foto
export type Photo = {
    id: number;
    image_filename: string;
    created_at: string;
};

// 2. Tipe untuk List Album
export type AlbumListItem = {
    id: number;
    title: string;
    name: string;
    description: string;
    image: string;
    date: string;
};

// 3. Tipe untuk Detail Album
export type AlbumDetail = {
    id: number;
    title: string;
    description: string;
    date: string;
    photos: Photo[];
};