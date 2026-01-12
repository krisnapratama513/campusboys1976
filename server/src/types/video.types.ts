/**
 * ==============================================================================
 * VIDEO TYPES DEFINITION
 * ==============================================================================
 * Definisi tipe data untuk modul Video (Galeri YouTube).
 */

import { RowDataPacket } from "mysql2";

export interface Video extends RowDataPacket {
    id: number;
    title: string;
    /** ID unik YouTube (11 karakter). Contoh: "sGYuS13qsOo" */
    youtube_id: string;
    /** Deskripsi singkat video */
    description: string | null;
    /** Status tayang: 1 = Aktif, 0 = Sembunyi */
    is_active: number;
}

/** Tipe data input untuk Create/Update */
export interface VideoInput {
    title: string;
    youtube_id: string;
    description: string;
    is_active: number;
}