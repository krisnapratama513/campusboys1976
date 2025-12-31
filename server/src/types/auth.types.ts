export type UserRole = 'superadmin' | 'editor' | 'creative' | 'member';

export interface JwtPayload {
    id: number;
    username: string;
    role: UserRole;
}

export interface LoginResponse {
    token: string;
    username: string;
    role: UserRole;
}