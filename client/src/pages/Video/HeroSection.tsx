// client/src/pages/Video/HeroSection.tsx

import React, { useRef, useState, useEffect } from 'react';
import styles from './HeroSection.module.css'; // Sesuaikan nama file module CSS Anda

const HeroSection = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [clipY, setClipY] = useState('70%'); // Default atau fallback

    useEffect(() => {
        const calculateClip = () => {
            const element = containerRef.current;
            if (!element) return;

            // 1. Ambil Dimensi Aktual (Relatif terhadap Induk)
            const width = element.offsetWidth;
            const height = element.offsetHeight; // Karena heroSection memiliki height: 50vh, ini akan mengembalikan nilai PX yang benar

            // 2. Perhitungan Responsif Anda:
            // Jarak vertikal potong = 10% dari Lebar (0.1 * width)
            const offsetPx = width * 0.1;
            
            // Posisi Y baru (dalam Piksel) = Tinggi total - Offset
            const newY_px = height - offsetPx;
            
            // 3. Konversi ke Persentase (Relative terhadap Tinggi total)
            const newY_percent = (newY_px / height) * 100;

            setClipY(`${newY_percent.toFixed(2)}%`); // Menggunakan toFixed(2) untuk presisi
        };

        // Jalankan saat komponen dimuat dan saat ukuran jendela berubah
        calculateClip();
        window.addEventListener('resize', calculateClip);
        window.addEventListener('orientationchange', calculateClip); // Untuk perangkat seluler

        return () => {
            window.removeEventListener('resize', calculateClip);
            window.removeEventListener('orientationchange', calculateClip);
        };
    }, []); 

    return (
        <header 
            ref={containerRef} 
            className={styles.heroSection}
            // Menerapkan CSS Variable ke elemen heroSection
            style={{ 
                '--dynamic-clip-y': clipY, 
            } as React.CSSProperties} // Cast untuk mengatasi properti kustom
        >
            <div className={styles.heroContentWrapper}>
                <h1 className={styles.pageTitle}>Our Video</h1>
            </div>
        </header>
    );
};

export default HeroSection;