// client/src/Pages/Home/InfiniteCarouselChapters.tsx

import { useState, useEffect, useMemo } from 'react';
import InfiniteCarousel from '../../components/InfiniteCarousel/InfiniteCarousel';
import type { ApiChapter } from '../../types/chapter.types';
import { getChapterList } from '../../services/chapterService';

/**
 * Komponen 'container' pintar (smart component) yang:
 * 1. Mengambil (fetch) data 'chapters' dari API.
 * 2. Mengubah (transform) data tersebut agar sesuai dengan prop 'InfiniteCarousel'.
 * 3. Me-render komponen 'dumb' 'InfiniteCarousel' dengan data yang sudah siap.
 */
const InfiniteCarouselChapters = () => {
    
    // State untuk menyimpan data mentah dari API
    const [chapters, setChapters] = useState<ApiChapter[]>([]);
    
    // State untuk melacak status loading
    const [loading, setLoading] = useState(true);

    // useEffect ini berjalan satu kali saat komponen pertama kali di-mount
    useEffect(() => {
        /**
         * ganti, dipindah di services/chapterService.ts
         */
        getChapterList()
        .then(data => {
            setChapters(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });

    }, []); // Array dependensi kosong berarti 'efek' ini hanya berjalan sekali

    /**
     * Menggunakan 'useMemo' untuk mengubah data 'chapters' menjadi format
     * yang dibutuhkan oleh 'InfiniteCarousel' (prop 'images').
     *
     * 'useMemo' memastikan transformasi ini hanya berjalan ulang
     * jika data 'chapters' berubah, bukan di setiap render.
     */
    const carouselImages = useMemo(() => {
        return chapters.map(chapter => ({
            // Menggunakan path dari folder 'public'
            src: `/chapter/${chapter.img}`,
            alt: `Logo ${chapter.name}`
        }));
    }, [chapters]); // Dependensi: hitung ulang hanya jika 'chapters' berubah

    
    // ----- RENDER -----

    // 2. Gunakan state 'loading'.
    // Jangan render apa-apa jika data masih dimuat.
    if (loading) {
        return null; // Anda bisa ganti dengan <LoadingSpinner />
    }

    // Jangan render jika data kosong setelah selesai loading
    if (carouselImages.length === 0) {
        return null; 
    }

    // Jika sudah tidak loading dan ada datanya, render carousel
    return (
        <InfiniteCarousel images={carouselImages} />
    );
}

export default InfiniteCarouselChapters;