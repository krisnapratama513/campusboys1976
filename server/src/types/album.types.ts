import { RowDataPacket } from "mysql2";

// Tabel 'album'
export interface Album extends RowDataPacket {
    id: number;
    title: string;
    name: string; // Kita akan gunakan ini sebagai SLUG (id_judul-album)
    description: string | null;
    image: string; // Foto Cover Album
    date: Date;
    status: 'publish' | 'pending' | string;
}

// Tabel 'photo'
export interface AlbumPhoto extends RowDataPacket {
    id: number;
    album_id: number;
    image_filename: string; // Foto Gallery
    created_at: Date;
}