// server/src/types/user.types.ts
import { RowDataPacket } from "mysql2";

// 1. Tipe data tabel 'members' (Sekarang ada chapter_id)
export interface Member extends RowDataPacket {
    id: number;
    username: string;
    role: 'superadmin' | 'editor' | 'creative' | 'member';
    chapter_id: number;
    generation: number;
}

// 2. Tipe data Gabungan (Untuk dikirim ke Frontend)
export interface MemberProfile extends Member {
    full_name: string | null;
    image: string | null;
    bio: string | null;
    phone: string | null;
    chapter_name: string; // Tambahan dari join chapters
}