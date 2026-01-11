import { API_BASE_URL } from '../config/api';

export const getDashboardStats = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error('Gagal memuat statistik dashboard');
    return await response.json();
};