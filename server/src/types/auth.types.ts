// server/src/types/auth.types.ts

export type UserRole = 'superadmin' | 'editor' | 'creative' | 'member';

export interface JwtPayload {
    id: number;
    username: string;
    role: UserRole;
    chapter_id: number; // <--- TAMBAHKAN INI
}

export interface LoginResponse {
    token: string;
    id: number;
    username: string;
    role: UserRole;
    chapter_id: number; // <--- TAMBAHKAN INI (Opsional, tapi bagus buat di frontend)
}