// src/components/SafeImage.tsx
import { useState, useEffect, type CSSProperties } from 'react';

interface SafeImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: CSSProperties; // Tambahkan ini
}

export const SafeImage = ({ src, alt, className, style }: SafeImageProps) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    // Sync state jika prop src berubah dari parent
    useEffect(() => {
        setImgSrc(src);
        setHasError(false); // Reset error status untuk gambar baru
    }, [src]);

    return (
        <img 
            src={imgSrc} 
            alt={alt} 
            className={className}
            style={style}
            onError={() => {
                if (!hasError) {
                    setHasError(true);
                    setImgSrc('https://placehold.co/100?text=No+Img');
                }
            }} 
        />
    );
};