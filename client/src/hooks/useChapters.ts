// client/src/hooks/useChapters.ts

import { useState, useEffect, useCallback } from 'react';
import { getChapters } from '../services/chapterService';
import type { Chapter } from '../types/chapter.types';

/**
 * Custom Hook: Mengelola state dan fetching data Chapter.
 * Memusatkan logika pemanggilan API agar komponen UI tetap bersih (DRY).
 * * @returns {Object} Berisi state `chapters`, status `loading`, pesan `error`, 
 * dan fungsi `refetch` untuk memuat ulang data secara manual.
 */
export const useChapters = () => {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Memanggil API dan mengupdate state.
     * Dibungkus dengan useCallback agar referensi fungsi tetap stabil 
     * di memori antar render, mencegah re-render komponen yang tidak perlu (Performance Optimization).
     */
    const fetchChapters = useCallback(() => {
        setLoading(true);
        setError(null);
        getChapters()
            .then(setChapters)
            .catch((err) => setError(err.message || "Gagal memuat data chapter."))
            .finally(() => setLoading(false));
    }, []);

    // Eksekusi fetching saat hook pertama kali digunakan (Mount)
    useEffect(() => {
        fetchChapters();
    }, [fetchChapters]);

    return { chapters, loading, error, refetch: fetchChapters };
};