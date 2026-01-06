// client/src/services/authorService.ts

import { API_BASE_URL } from '../config/api';

// Kita definisikan tipe datanya di sini agar bisa dipakai ulang
export interface Author {
    id: number;
    name: string;
    total_articles?: number;
    total_fanzine?: number;
}

// 1. AMBIL SEMUA AUTHOR (Dipakai di AuthorList & CreateFanzine)
export const getAllAuthors = async (): Promise<Author[]> => {
    const response = await fetch(`${API_BASE_URL}/authors`);
    if (!response.ok) {
        throw new Error('Gagal mengambil data authors');
    }
    const result = await response.json();
    return result.data; // Mengembalikan array authors
};

// 2. AMBIL SATU AUTHOR (Dipakai di AuthorEdit)
export const getAuthorById = async (id: number | string): Promise<Author> => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}`);
    if (!response.ok) {
        throw new Error('Gagal mengambil detail author');
    }
    const result = await response.json();
    return result.data;
};

// 3. TAMBAH AUTHOR (Dipakai di AuthorCreate)
export const createAuthor = async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal menambah author');
    }
    return response.json();
};

// 4. UPDATE AUTHOR (Dipakai di AuthorEdit)
export const updateAuthor = async (id: number | string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal update author');
    }
    return response.json();
};

// 5. DELETE AUTHOR (Dipakai di AuthorList)
export const deleteAuthor = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal menghapus author');
    }
    return response.json();
};