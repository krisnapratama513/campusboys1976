// client/src/hooks/usePublicAlbumBySlug.ts

import { useState, useEffect } from 'react';
import { getPublicAlbumBySlug } from '@/services/albumService';
import type { Album } from '@/types/album.types';

export const usePublicAlbumBySlug = (slug: string | undefined) => {
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        getPublicAlbumBySlug(slug, { signal: controller.signal })
            .then(
                data => {
                    setAlbum(data);
                    setLoading(false);
                }
            )
            .catch(err => {
                if (err.name === 'AbortError') return;
                setError('Gagal memuat detail album.');
                setLoading(false);
            })

        return () => controller.abort();
    }, [slug]);

    return { album, loading, error };
};