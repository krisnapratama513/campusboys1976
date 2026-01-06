// client/src/service/fanzineService.ts

import type { FanzineType } from "../types/fanzine.types";
import { API_BASE_URL } from "../config/api";

// 1. Definisikan bentuk respon Backend (Wrapper)
interface FanzineResponse {
    message: string;
    data: FanzineType[];
}

interface FanzineDetailResponse {
    message: string;
    data: FanzineType;
}

export const getAllFanzine = async (): Promise<FanzineType[]> => {
    const response = await fetch(`${API_BASE_URL}/fanzines`);
    if(!response.ok) throw new Error('Gagal mengambil data getAllFanzine');
    
    // UBAH DI SINI:
    const result: FanzineResponse = await response.json();
    return result.data; // <--- Ambil isinya saja
};

// Sekalian saya tambahkan untuk Get By Slug
export const getFanzineBySlug = async (slug: string): Promise<FanzineType> => {
    const response = await fetch(`${API_BASE_URL}/fanzines/${slug}`);
    if(!response.ok) throw new Error('Gagal mengambil detail fanzine');

    const result: FanzineDetailResponse = await response.json();
    return result.data; // <--- Ambil isinya saja
};

export const createFanzine = async (formData: FormData) => {
    // PENTING: Jangan set 'Content-Type': 'application/json'
    // Biarkan browser yang mengurus Header untuk FormData (Multipart)
    const response = await fetch(`${API_BASE_URL}/fanzines`, {
        method: 'POST',
        body: formData, 
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal membuat fanzine');
    }

    return response.json();
};


export const deleteFanzine = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/fanzines/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal menghapus fanzine');
    }
    return response.json();
};


export const getFanzineById = async (id: string | number): Promise<FanzineType> => {
    const response = await fetch(`${API_BASE_URL}/fanzines/detail/${id}`);
    if (!response.ok) throw new Error('Gagal mengambil data fanzine');
    const result = await response.json();
    return result.data;
};

// 2. Update Data (Pakai FormData karena ada file)
export const updateFanzine = async (id: string | number, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/fanzines/${id}`, {
        method: 'PUT', // Method PUT
        body: formData,
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal update fanzine');
    }
    return response.json();
};