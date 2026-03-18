import { useState, useEffect } from 'react';
import { getAllFanzine } from '@/services/fanzineService';
import type { FanzineType } from '@/types/fanzine.types';

export const useFanzines = (page: number) => {
    const [fanzines, setFanzines] = useState<FanzineType[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        // Pastikan service getAllFanzine sudah diperbarui untuk menerima { signal }
        getAllFanzine(page, { signal: controller.signal })
            .then(res => {
                setFanzines(res.data);
                setTotalPages(res.pagination.totalPages);
                setLoading(false)
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                setError("Gagal memuat fanzine.");
                setLoading(false)
            })

        return () => controller.abort();
    }, [page]);

    return { fanzines, totalPages, loading, error };
};