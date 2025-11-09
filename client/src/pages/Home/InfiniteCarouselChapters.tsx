// client/src/Pages/Home/InfiniteCarouselChapters.tsx

// 1. Impor HANYA hooks yang kita perlukan dari React
import { useState, useEffect, useMemo } from 'react';
// import InfiniteCarousel from "./InfiniteCarousel";
import InfiniteCarousel from '../../components/InfiniteCarousel/InfiniteCarousel';

/**
 * Tipe data ini mendefinisikan struktur data Chapter
 * yang kita harapkan dari API.
 */
type ApiChapter = {
    id: number;
    name: string;
    description: string;
    img: string;
};

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
         * Fungsi async untuk mengambil data dari endpoint API server.
         */
        const fetchChapters = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/chapters/list');
                
                // Tambahkan pengecekan jika respons API tidak sukses
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ApiChapter[] = await response.json();
                setChapters(data);
            } catch (error) {
                console.error("Gagal mengambil data chapters:", error);
            } finally {
                // Set loading menjadi false setelah fetch selesai (baik sukses atau gagal)
                setLoading(false);
            }
        };

        fetchChapters();
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