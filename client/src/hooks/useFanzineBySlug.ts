import { useState, useEffect } from 'react';
import { getFanzineBySlug } from '@/services/fanzineService';
import type { FanzineType } from '@/types/fanzine.types';

export const useFanzineBySlug = (slug: string | undefined) => {
    const [fanzine, setFanzine] = useState<FanzineType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        setIsLoading(true);

        getFanzineBySlug(slug, { signal: controller.signal })
            .then((data) => {
                setFanzine(data);
                setIsLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setIsLoading(false);
            });

        return () => controller.abort();
    }, [slug]);

    return { fanzine, isLoading };
};