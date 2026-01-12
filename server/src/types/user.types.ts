// server/src/types/user.types.ts

/**
 * ==============================================================================
 * USER TYPES DEFINITION
 * ==============================================================================
 * Definisi tipe data untuk User/Member dalam sistem.
 */

import { RowDataPacket } from "mysql2";

/**
 * Data dasar tabel 'members' (Akun Login).
 */
export interface Member extends RowDataPacket {
    id: number;
    username: string;
    role: 'superadmin' | 'editor' | 'creative' | 'member';
    chapter_id: number;
    generation: number;
}

/**
 * Data gabungan 'members' + 'member_details' + 'chapters'.
 * Digunakan untuk response API profil lengkap.
 */
export interface MemberProfile extends Member {
    full_name: string | null;
    image: string | null;
    bio: string | null;
    phone: string | null;
    chapter_name: string; // Hasil Join
}