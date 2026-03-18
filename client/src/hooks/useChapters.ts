// client/src/hooks/useChapters.ts
import { useState, useEffect, useCallback } from 'react';
import { getChapters } from '../services/chapterService';
import type { Chapter } from '../types/chapter.types';

export const useChapters = () => {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        
        setLoading(true);
        setError(null);

        // Pastikan getChapters menerima parameter signal
        getChapters({ signal: controller.signal })
            .then((data) => {
                setChapters(data);
                setLoading(false);
            })
            .catch((err) => {
                // Abaikan error jika request dibatalkan karena komponen unmount
                if (err.name === 'AbortError') return; 
                setError(err.message || "Gagal memuat data chapter.");
                setLoading(false);
            })

        // Cleanup: Mencegah memory leak dan race condition
        return () => controller.abort(); 
    }, []);

    // Optimasi: Hapus item dari UI secara instan (Optimistic Update)
    const removeChapterLocal = useCallback((id: number) => {
        setChapters((prev) => prev.filter(chapter => chapter.id !== id));
    }, []);

    return { chapters, loading, error, removeChapterLocal };
};