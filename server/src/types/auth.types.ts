// server/src/types/auth.types.ts

/**
 * ==============================================================================
 * AUTH TYPES DEFINITION
 * ==============================================================================
 * Mendefinisikan bentuk data (Shape) untuk sistem autentikasi.
 * Digunakan di Service, Controller, dan Middleware.
 */

/**
 * Daftar Role (Jabatan) yang tersedia dalam aplikasi.
 * - 'superadmin': Akses penuh ke seluruh sistem (User & Chapter).
 * - 'editor': Fokus pada manajemen artikel/konten teks.
 * - 'creative': Fokus pada manajemen media (album/video).
 * - 'member': User biasa (hanya view).
 */
export type UserRole = 'superadmin' | 'editor' | 'creative' | 'member';

/**
 * Struktur data yang disimpan di dalam Token JWT (enkripsi).
 * Data ini bisa dibaca lewat req.user di middleware.
 */
export interface JwtPayload {
    /** Primary Key user dari database */
    id: number;
    /** Username untuk display */
    username: string;
    /** Role untuk otorisasi akses (Guard) */
    role: UserRole;
    /** ID Chapter tempat user bernaung (untuk filtering konten per wilayah) */
    chapter_id: number;
}

/**
 * Struktur respon API saat Login berhasil.
 * Dikirimkan kembali ke Client (Frontend).
 */
export interface LoginResponse {
    /** Token JWT (Bearer Token) untuk akses API selanjutnya */
    token: string;
    id: number;
    username: string;
    role: UserRole;
    chapter_id: number;
}