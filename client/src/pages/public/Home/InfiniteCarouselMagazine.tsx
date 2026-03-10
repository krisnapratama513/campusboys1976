// client/src/pages/Home/InfiniteCarouselMagazine.tsx

import { useState, useEffect, useMemo } from "react";
import InfiniteCarousel2 from "../../../components/InfiniteCarousel2/InfiniteCarousel2";
import { getRecentFanzines } from "../../../services/fanzineService";
import type { FanzineType } from "../../../types/fanzine.types";

// [PENTING] Import Config untuk menyusun URL gambar dari server
import { SERVER_ROOT } from "../../../config/api";

/**
 * Komponen Carousel Majalah (Fanzine) di Halaman Home.
 * Menampilkan cover majalah yang berjalan otomatis (Infinite Scroll).
 */
const InfiniteCarouselMagazine = () => {
    const [fanzines, setFanzines] = useState<FanzineType[]>([]);

    useEffect(() => {
        getRecentFanzines()
            .then(data => {
                setFanzines(data); // Langsung set array
            })
            .catch(err => {
                console.error("[InfiniteCarousel] Error:", err);
            });
    }, []);

    // [MEMO] Optimasi rendering list gambar
    const carouselImages = useMemo(() => {
        return fanzines.map(fanzine => ({
            // Arahkan ke folder uploads di server backend
            src: `${SERVER_ROOT}/uploads/fanzines/covers/${fanzine.imgFilename}`,
            
            // Menggunakan judul majalah untuk alt text
            alt: `Cover ${fanzine.title}` 
        }));
    }, [fanzines, SERVER_ROOT]); // Tambahkan serverRoot ke dependency array

    // Optional: Jangan render jika data kosong
    if (fanzines.length === 0) return null;

    return (
        <InfiniteCarousel2 images={carouselImages} direction="left" />
    );
};

export default InfiniteCarouselMagazine;