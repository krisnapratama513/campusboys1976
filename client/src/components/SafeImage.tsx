// client/src/components/SafeImage.tsx
import { useState, useEffect, type ImgHTMLAttributes } from 'react';

// Extend dari ImgHTMLAttributes agar mewarisi semua prop bawaan <img>
interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

export const SafeImage = ({ src, alt, className, style, ...rest }: SafeImageProps) => {
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
            {...rest} // Lempar sisa prop (seperti loading="lazy") ke sini
            onError={() => {
                if (!hasError) {
                    setHasError(true);
                    setImgSrc('https://placehold.co/100?text=No+Img');
                }
            }} 
        />
    );
};