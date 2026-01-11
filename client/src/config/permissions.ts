// client/src/config/permissions.ts

export type UserRole = 'superadmin' | 'editor' | 'creative' | 'member';

export const PERMISSIONS = {
    // 1. MANAGEMENT USER
    // Tambahkan 'as UserRole[]' agar TypeScript tahu ini bukan string sembarangan
    CAN_MANAGE_USERS: ['superadmin'] as UserRole[], 
    
    CAN_VIEW_USERS: ['superadmin', 'editor', 'creative', 'member'] as UserRole[],

    // 2. MANAGEMENT CONTENT (EDITOR)
    CAN_MANAGE_EDITORIAL: ['superadmin', 'editor'] as UserRole[],

    // 3. MANAGEMENT MEDIA (CREATIVE)
    CAN_MANAGE_CREATIVE: ['superadmin', 'creative'] as UserRole[],

    // 4. MANAGEMENT CHAPTER (SUPERADMIN)
    CAN_MANAGE_CHAPTERS: ['superadmin'] as UserRole[],
};

// Helper function
export const hasAccess = (userRole: string, allowedRoles: UserRole[]): boolean => {
    // Kita cast userRole ke UserRole agar perbandingannya valid
    return allowedRoles.includes(userRole as UserRole);
};