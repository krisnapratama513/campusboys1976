// client/src/Pages/Home/InfiniteCarouselChapters.tsx

import { useState, useEffect, useMemo } from 'react';
import InfiniteCarousel from '../../../components/InfiniteCarousel/InfiniteCarousel';

// 1. Import Type yang sesuai (Hanya butuh ID dan IMG)
import type { ChapterImage } from '../../../types/chapter.types';

// 2. Import Service yang baru (Optimized fetch)
import { getChapterImages } from '../../../services/chapterService';

const InfiniteCarouselChapters = () => {
    
    // State menggunakan tipe ChapterImage[]
    const [chapters, setChapters] = useState<ChapterImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Panggil service khusus images
        getChapterImages()
        .then(data => {
            setChapters(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Gagal load carousel chapters:", err);
            setLoading(false);
        });

    }, []);

    const carouselImages = useMemo(() => {
        return chapters.map(chapter => ({
            // Menggunakan path dari folder 'public/chapters'
            src: `/chapters/${chapter.img}`,
            
            // Note: Karena endpoint ini tidak mengambil 'name', kita pakai ID untuk alt
            alt: `Chapter Logo ${chapter.id}` 
        }));
    }, [chapters]);

    
    // ----- RENDER -----

    if (loading) return null;

    if (carouselImages.length === 0) return null; 

    return (
        <InfiniteCarousel images={carouselImages} />
    );
}

export default InfiniteCarouselChapters;