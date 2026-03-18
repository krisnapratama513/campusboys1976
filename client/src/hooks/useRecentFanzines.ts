// client/src/hooks/useRecentFanzines.ts

import {useState, useEffect} from 'react';
import { getRecentFanzines } from '@/services/fanzineService';
import { SERVER_ROOT } from '@/config/api';

export const useRecentFanzines = () => {
    const [images, setImages] = useState<{src: string; alt: string} []> ([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        getRecentFanzines({signal: controller.signal})
            .then((data) => {
                const formattedImages = data.map((fanzine) => ({
                    src: `${SERVER_ROOT}/uploads/fanzines/covers/${fanzine.imgFilename}`,
                    alt: `Cover Fanzine ${fanzine.id}`
                }));
                setImages(formattedImages);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setError(err.message || "Gagal memuat recent fanzine.");
                setLoading(false)
            })

        return () => controller.abort();
    }, []);
        
    return{images,loading,error}
};