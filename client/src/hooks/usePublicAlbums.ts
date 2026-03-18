// client/src/hooks/usePublicAlbums.ts
import { useState, useEffect } from 'react';
import { getPublicAlbums } from '@/services/albumService';
import type { Album } from '@/types/album.types';

export const usePublicAlbums = (page: number) => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        getPublicAlbums(page, { signal: controller.signal }) 
            .then(res => {
                setAlbums(res.data);
                setTotalPages(res.pagination.totalPages);
                setLoading(false);
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                setError("Gagal memuat album.");
                setLoading(false);
            })

        return () => controller.abort();
    }, [page]); // Re-fetch aman saat 'page' berubah

    return { albums, totalPages, loading, error };
};