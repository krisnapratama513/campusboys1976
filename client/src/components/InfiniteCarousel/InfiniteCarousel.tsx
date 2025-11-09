// client/src/components/InfiniteCarousel/InfiniteCarousel.tsx

import React, { useRef, useEffect, useState } from 'react';
import styles from './InfiniteCarousel.module.css';

// 1. Definisikan tipe untuk satu logo (Nama Tipe pakai PascalCase - SUDAH BENAR)
type Image = {
    src: string;
    alt: string;
};

// 2. Definisikan interface props
interface InfiniteCarouselProps{
    // Nama prop harus camelCase (huruf kecil)
    images: Image[];
}

// 3. Terima 'images' (huruf kecil) sebagai prop
const InfiniteCarousel: React.FC<InfiniteCarouselProps>  = ({ images }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // 4. Pindahkan TOTAL_IMAGES ke dalam, agar dinamis berdasarkan props
    // Gunakan 'images' (huruf kecil)
    const TOTAL_IMAGES = images.length * 2;

    const [imagesLoadedCount, setImagesLoadedCount] = useState(0);

    const handleImageLoad = () => {
        setImagesLoadedCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        // Gunakan 'images' (huruf kecil)
        if (images.length > 0 && imagesLoadedCount === TOTAL_IMAGES){
            if (trackRef.current && containerRef.current){
                const track = trackRef.current;
                const container = containerRef.current;

                const totalWidth = track.scrollWidth;
                const setWidth = totalWidth / 2;

                if (setWidth > 0 ){
                    container.style.setProperty(
                        '--scroll-start-width', 
                        `-${setWidth}px`
                    );
                }
            }
        }
    }, [imagesLoadedCount, TOTAL_IMAGES, images.length]); // Gunakan 'images.length'

    return (
        <div 
            className={styles.container} 
            ref={containerRef}
        >
            <div 
                className={styles.itemTrack} 
                ref={trackRef}
            >
                {/* Render Set 1 dari prop 'images' */}
                {/* Gunakan 'image' (huruf kecil) untuk variabel map */}
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
                
                {/* Render Set 2 (Duplikat) dari prop 'images' */}
                {/* Gunakan 'image' (huruf kecil) untuk variabel map */}
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