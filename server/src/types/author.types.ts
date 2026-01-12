/**
 * ==============================================================================
 * AUTHOR TYPES DEFINITION
 * ==============================================================================
 * Definisi tipe data untuk entitas Author (Penulis).
 */

import { RowDataPacket } from 'mysql2';

/**
 * Representasi data dasar Author dari database.
 */
export interface Author extends RowDataPacket {
    id: number;
    name: string;
}

/**
 * Extension untuk Author dengan tambahan data statistik.
 * Digunakan saat menampilkan daftar author di halaman admin (dashboard).
 */
export interface AuthorWithStats extends Author {
    /** Jumlah artikel yang ditulis */
    total_articles: number;
    /** Jumlah fanzine yang dibuat */
    total_fanzine: number;
}