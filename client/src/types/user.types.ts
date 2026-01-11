// client/src/types/user.types.ts

export type UserRole = 'superadmin' | 'editor' | 'creative' | 'member';

// 1. Tipe Data Ringan (Untuk Tabel List)
export interface Member {
    id: number;
    username: string;
    role: UserRole;
    chapter_id: number;
    chapter_name: string; // Join dari backend
    generation: number;
}

// 2. Tipe Data Lengkap (Untuk Modal Detail)
export interface MemberDetail extends Member {
    full_name: string; // Bisa string kosong '' dari backend
    image: string;     // Default 'default_user.png'
    bio: string;
    phone: string;
}

// 3. Tipe Data Input Form (Create User)
export interface CreateUserInput {
    username: string;
    password: string;
    role: UserRole;
    chapter_id: number;
    generation: number;
}