import { useState, useEffect } from 'react';
import { getChapterImages } from '@/services/chapterService';
import { SERVER_ROOT } from '@/config/api';

export const useChapterImages = () => {
    // State langsung menyimpan format yang dibutuhkan Carousel
    const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        getChapterImages({ signal: controller.signal })
            .then((data) => {
                // Transformasi data dilakukan di layer hook, UI tinggal pakai
                const formattedImages = data.map((chapter) => ({
                    src: `${SERVER_ROOT}/uploads/chapters/${chapter.img}`,
                    alt: `Chapter Logo ${chapter.id}`
                }));
                setImages(formattedImages);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setError(err.message || "Gagal memuat gambar chapter.");
                setLoading(false)
            })

        return () => controller.abort();
    }, []);

    return { images, loading, error };
};