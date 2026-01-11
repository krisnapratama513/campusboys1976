// client/src/services/userService.ts

import { API_BASE_URL } from '../config/api';
import type { Member, MemberDetail, CreateUserInput } from '../types/user.types';

// 1. GET List Members (Ringan - Tabel)
export const getMembers = async (): Promise<Member[]> => {
    const res = await fetch(`${API_BASE_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Butuh token admin
        }
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal mengambil data member');
    
    // Backend mengembalikan { data: [...] }
    return result.data;
};

// 2. GET Member Detail (Berat - Modal)
export const getMemberDetail = async (id: number): Promise<MemberDetail> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal mengambil detail member');
    
    return result.data;
};

// 3. CREATE Member (Superadmin)
export const createMember = async (data: CreateUserInput) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal membuat member');
    
    return result;
};

// 4. DELETE Member
export const deleteMember = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal menghapus member');
    
    return result;
};

// 5. UPDATE Profile (Untuk Member - Upload File)
// Kita siapkan saja function ini untuk halaman 'My Profile' nanti
export const updateMyProfile = async (id: number, formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}/profile`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            // Jangan set Content-Type manual saat pakai FormData
        },
        body: formData
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal update profile');
    
    return result;
};

// UPDATE USERNAME ONLY
export const updateUsername = async (id: number, newUsername: string) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}/username`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ username: newUsername })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal ganti username');
    
    return result;
};

export const changePassword = async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal ganti password');
    
    return result;
};


// UPDATE MEMBER BY ADMIN (Ganti Role/Chapter/Gen)
export const updateMemberByAdmin = async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal update member');
    
    return result;
};