// client/src/Pages/Home/InfiniteCarouselChapters.tsx

import { useState, useEffect, useMemo } from 'react';
import InfiniteCarousel from '../../../../components/InfiniteCarousel/InfiniteCarousel';

// Import Config untuk mendapatkan alamat Server
import { SERVER_ROOT } from '../../../../config/api';

// Import Type dan Service
import type { ChapterImage } from '../../../../types/chapter.types';
import { getChapterImages } from '../../../../services/chapterService';

/**
 * Komponen Carousel Chapter (Infinite Loop).
 * Menampilkan logo-logo chapter yang diambil dari server backend.
 * * @component
 * @returns {JSX.Element | null} Komponen Carousel atau null jika loading/kosong
 */
const InfiniteCarouselChapters = () => {
    
    /**
     * State untuk menyimpan daftar gambar chapter.
     * Menggunakan tipe ChapterImage[] yang ringan (hanya id & img).
     */
    const [chapters, setChapters] = useState<ChapterImage[]>([]);
    
    /** State penanda proses loading data */
    const [loading, setLoading] = useState(true);

    /**
     * Effect: Mengambil data gambar chapter saat komponen dimuat.
     * Menggunakan service 'getChapterImages' yang sudah teroptimasi.
     */
    useEffect(() => {
        let isMounted = true; // Flag untuk mencegah update state jika komponen sudah unmount

        getChapterImages()
        .then(data => {
            if (isMounted) {
                setChapters(data);
                setLoading(false);
            }
        })
        .catch(err => {
            console.error("[InfiniteCarousel] Gagal load chapters:", err);
            if (isMounted) setLoading(false);
        });

        return () => { isMounted = false; };
    }, []);

    /**
     * Memoized Data: Mengubah format data API menjadi format yang dibutuhkan Carousel.
     * * Perubahan Penting:
     * Mengubah path gambar dari client-side relative path ('/chapters/...')
     * menjadi server-side static URL ('http://host/uploads/chapters/...').
     */
    const carouselImages = useMemo(() => {
        return chapters.map(chapter => ({
            // 2. Konstruksi URL lengkap ke folder uploads server
            src: `${SERVER_ROOT}/uploads/chapters/${chapter.img}`,
            
            // Alt text untuk aksesibilitas
            alt: `Chapter Logo ${chapter.id}` 
        }));
    }, [chapters]);

    // ----- RENDER -----

    // Jangan tampilkan apa-apa saat loading atau jika data kosong
    if (loading || carouselImages.length === 0) return null;

    return (
        <InfiniteCarousel images={carouselImages} theme='navy'/>
    );
}

export default InfiniteCarouselChapters;