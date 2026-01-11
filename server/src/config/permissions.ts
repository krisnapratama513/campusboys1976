/**
 * ==============================================================================
 * SERVER PERMISSIONS CONFIGURATION
 * ==============================================================================
 * Mendefinisikan Role dan Hak Akses untuk sisi Backend.
 * File ini harus selaras dengan logika di Client.
 */

export type UserRole = 'superadmin' | 'editor' | 'creative' | 'member';

export const PERMISSIONS = {
    // 1. MANAGEMENT USER & CHAPTER (Superadmin Only)
    CAN_MANAGE_USERS: ['superadmin'] as UserRole[],
    CAN_MANAGE_CHAPTERS: ['superadmin'] as UserRole[], // <--- Ini yang dipakai di route chapter

    // 2. MANAGEMENT CONTENT (Editor & Superadmin)
    CAN_MANAGE_EDITORIAL: ['superadmin', 'editor'] as UserRole[],

    // 3. MANAGEMENT MEDIA (Creative & Superadmin)
    CAN_MANAGE_CREATIVE: ['superadmin', 'creative'] as UserRole[],

    // 4. GENERAL ACCESS
    CAN_VIEW_CONTENT: ['superadmin', 'editor', 'creative', 'member'] as UserRole[],
};