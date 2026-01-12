// client/src/services/userService.ts

/**
 * ==============================================================================
 * USER SERVICE (CLIENT)
 * ==============================================================================
 * Mengelola komunikasi API untuk modul User.
 * Menangani Header Authorization secara otomatis.
 */

import { API_BASE_URL } from '../config/api';
import type { Member, MemberDetail, CreateUserInput } from '../types/user.types';

// Helper: Header Auth
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

/**
 * GET List Members (Ringan - Tabel Directory)
 * Public Endpoint (Bisa diakses user login manapun)
 */
export const getMembers = async (): Promise<Member[]> => {
    const res = await fetch(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal mengambil data member');
    return result.data;
};

/**
 * GET Member Detail (Berat - Modal)
 * Mengambil data lengkap termasuk Bio, Phone, dll.
 */
export const getMemberDetail = async (id: number): Promise<MemberDetail> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal mengambil detail member');
    return result.data;
};

/**
 * CREATE Member (Superadmin Only)
 * Membuat user baru dengan role dan akses awal.
 */
export const createMember = async (data: CreateUserInput) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal membuat member');
    return result;
};

/**
 * DELETE Member (Superadmin Only)
 */
export const deleteMember = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal menghapus member');
    return result;
};

/**
 * UPDATE Profile (User Self Service)
 * Menggunakan FormData untuk upload foto profil.
 */
export const updateMyProfile = async (id: number, formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}/profile`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            // Content-Type otomatis diurus browser saat pakai FormData
        },
        body: formData
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal update profile');
    return result;
};

/**
 * UPDATE Username (User Self Service)
 */
export const updateUsername = async (id: number, newUsername: string) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}/username`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ username: newUsername })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal ganti username');
    return result;
};

/**
 * UPDATE Password (User Self Service)
 */
export const changePassword = async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}/password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal ganti password');
    return result;
};

/**
 * UPDATE Member Access (Admin Only)
 * Mengubah Role, Chapter, dan Angkatan.
 */
export const updateMemberByAdmin = async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal update member');
    return result;
};