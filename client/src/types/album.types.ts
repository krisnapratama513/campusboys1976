// client/src/types/album.types.ts

// 1. Tipe Foto (Digunakan di Public & Admin)
export interface AlbumPhoto {
    id: number;
    album_id: number; // Frontend public mungkin tidak butuh ini, tapi tidak apa-apa ada
    image_filename: string;
    created_at: string;
}

// 2. Tipe Album Utama (Gabungan kebutuhan Public & Admin)
export interface Album {
    id: number;
    title: string;
    name: string; // Slug
    description: string;
    image: string; // Cover filename
    date: string;  // Tanggal event
    
    // Status wajib untuk Admin, optional/diabaikan untuk Public list
    status: 'publish' | 'pending'; 
    
    // Photos optional, karena di List View (Card) kita tidak muat foto gallery
    photos?: AlbumPhoto[]; 
}

// Tambahkan di paling bawah file
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

export interface PublicAlbumsResponse {
    message: string;
    data: Album[];
    pagination: PaginationMeta;
}