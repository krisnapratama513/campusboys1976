// client/src/hooks/useScrollAnimation.ts
import { useEffect, useRef } from 'react';

export const useScrollAnimation = (animationClass: string) => {
    // Tipe data diatur ke HTMLElement agar bisa dipakai di <section>, <div>, dll.
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const getThreshold = () => {
            if (window.innerWidth <= 480) return 0.05;
            if (window.innerWidth <= 768) return 0.1;
            return 0.2;
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(animationClass);
                        // Opsional: Hapus komentar di bawah jika ingin animasi hanya jalan 1x
                        // observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: getThreshold() }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            observer.disconnect(); // Lebih aman menggunakan disconnect saat komponen unmount
        };
    }, [animationClass]);

    return elementRef;
};