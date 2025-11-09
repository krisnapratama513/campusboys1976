// client/src/components/InfiniteCarousel/InfiniteCarousel.tsx

import React, { useRef, useEffect, useState } from 'react';
import styles from './InfiniteCarousel.module.css';

type Image = {
    src: string;
    alt: string;
};

/**=======================
 * Daftar gambar yang akan ditampilkan di carousel.
 * Arah pergerakan carousel.
=========================*/
interface InfiniteCarouselProps {
    images: Image[];
    direction?: 'left' | 'right';
}

/**
 * Sebuah komponen carousel "tak terbatas" (infinite) yang terus-menerus
 * menggulir daftar gambar. Ini dicapai dengan menduplikasi set gambar.
 */
const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
    images,
    direction = 'right' // Default ke kanan jika tidak ada prop yang diberikan
}) => {
    // Refs digunakan untuk mengakses elemen DOM secara langsung untuk pengukuran
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // TOTAL_IMAGES adalah jumlah *aktual* elemen DOM (set gambar asli x 2)
    const TOTAL_IMAGES = images.length * 2;

    // State untuk melacak kapan semua gambar telah dimuat.
    // Ini penting untuk mencegah perhitungan lebar sebelum gambar dirender.
    const [imagesLoadedCount, setImagesLoadedCount] = useState(0);

    /**
     * Dipanggil setiap kali gambar (baik berhasil atau gagal) selesai dimuat.
     */
    const handleImageLoad = () => {
        setImagesLoadedCount((prevCount) => prevCount + 1);
    };

    /**
     * Efek ini berjalan setelah semua gambar dimuat.
     * Ia menghitung lebar total dari *satu* set gambar (setengah dari total lebar track)
     * dan menyetelnya sebagai CSS Custom Property (--scroll-start-width).
     *
     * Variabel CSS ini kemudian digunakan oleh animasi @keyframes di file CSS.
     */
    useEffect(() => {
        // Hanya jalankan kalkulasi jika kita punya gambar DAN semua gambar duplikat telah dimuat
        if (images.length > 0 && imagesLoadedCount === TOTAL_IMAGES) {
            if (trackRef.current && containerRef.current) {
                const track = trackRef.current;
                const container = containerRef.current;

                // Lebar 'setWidth' adalah lebar dari *satu* set gambar (setengah dari total)
                const totalWidth = track.scrollWidth;
                const setWidth = totalWidth / 2;

                if (setWidth > 0) {
                    // Setel variabel CSS yang akan digunakan oleh animasi keyframes
                    container.style.setProperty(
                        '--scroll-start-width',
                        `-${setWidth}px`
                    );
                }
            }
        }
        // Dependensi: Jalankan ulang hanya jika jumlah gambar atau status pemuatan berubah
    }, [imagesLoadedCount, TOTAL_IMAGES, images.length]);

    // Terapkan kelas CSS yang benar berdasarkan prop 'direction'
    // Ini memetakan prop 'direction' ke kelas CSS Module yang sesuai.
    const directionClass =
        direction === 'right' ? styles.scrollRight : styles.scrollLeft;

    return (
        <div
            className={styles.container}
            ref={containerRef}
        >
            <div
                className={`${styles.itemTrack} ${directionClass}`}
                ref={trackRef}
            >
                {/* Render Set 1 (Original) */}
                {images.map((image, index) => (
                    <div className={styles.item} key={`set1-${index}`}>
                        <img
                            src={image.src}
                            alt={image.alt}
                            onLoad={handleImageLoad}
                            onError={handleImageLoad}
                        />
                    </div>
                ))}

                {/* Render Set 2 (Duplikat) */}
                {/* Menduplikasi set gambar adalah trik untuk menciptakan 
                    ilusi loop "tak terbatas" yang mulus. */}
                {images.map((image, index) => (
                    <div className={styles.item} key={`set2-${index}`}>
                        <img
                            src={image.src}
                            alt={image.alt}
                            onLoad={handleImageLoad}
                            onError={handleImageLoad}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InfiniteCarousel;