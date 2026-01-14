// client/src/pages/public/About/index.tsx

import { useEffect, useRef, useState } from 'react';
import styles from './AboutPage.module.css';
import HeroSection from './HeroSection';

// Import Config untuk mendapatkan alamat Server
import { SERVER_ROOT } from '../../../config/api';

import { type AboutContent } from '../../../types/about';
import type { Chapter } from '../../../types/chapter.types';
import { MOCK_aboutData } from '../../../data/mockAbout';
import { getChapters } from '../../../services/chapterService';

/**
 * Halaman About (Tentang Kami).
 * Menampilkan filosofi komunitas dan daftar Chapter (Cabang) yang terdaftar.
 * * Fitur Utama:
 * 1. Menampilkan konten statis filosofi.
 * 2. Mengambil data Chapter dinamis dari API Backend.
 * 3. Animasi 'Reveal' saat scroll menggunakan IntersectionObserver.
 * * @component
 * @returns {JSX.Element} Halaman About lengkap
 */
const AboutPage = () => {
    /** Data statis untuk konten teks (Judul & Paragraf) */
    const aboutData: AboutContent = MOCK_aboutData;
    
    /** State untuk menyimpan daftar chapter dari database */
    const [chapters, setChapters] = useState<Chapter[]>([]);
    
    /** Ref ke elemen <main> untuk keperluan observasi scroll */
    const mainRef = useRef<HTMLElement>(null);

    /**
     * Effect 1: Fetch Data Chapter
     * Mengambil data saat komponen pertama kali dimuat (Mount).
     */
    useEffect(() => {
        getChapters()
            .then(data => {
                setChapters(data);
            })
            .catch(err => {
                console.error("[AboutPage] Gagal memuat chapters:", err);
            });
    }, []);

    /**
     * Effect 2: Scroll Animation (IntersectionObserver)
     * Memberikan kelas '.active' pada elemen dengan kelas '.reveal'
     * saat elemen tersebut masuk ke viewport layar.
     * * Dependency [chapters] ditambahkan agar observer di-refresh 
     * setelah data chapter selesai dimuat dan dirender.
     */
    useEffect(() => {
        const revealElements = mainRef.current?.querySelectorAll(`.${styles.reveal}`);
        if (!revealElements || revealElements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.active);
                        // Opsional: Stop observe setelah muncul sekali agar hemat resource
                        // observer.unobserve(entry.target); 
                    }
                });
            },
            { threshold: 0.1 } // Trigger saat 10% elemen terlihat
        );

        revealElements.forEach((el) => {
            observer.observe(el);
        });

        // Cleanup function saat unmount atau chapters berubah
        return () => {
            revealElements.forEach((el) => {
                observer.unobserve(el);
            });
        };
    }, [chapters]);


    // 3. Render Komponen
    return (
        <div className={styles.aboutPageWrapper}>
            <div style={{ height: '60px' }}></div>

            <HeroSection />

            <div className={styles.container}>
                <main ref={mainRef}>
                    {/* Bagian Filosofi */}
                    <section className={styles.philosophy}>
                        <h2>{aboutData.judul}</h2>
                        {aboutData.paragraf.map((p, index) => (
                            <p key={index}>{p}</p>
                        ))}
                    </section>

                    {/* Bagian Daftar Chapter */}
                    <section className={styles.chaptersSection}>
                        <h2 className={styles.reveal}>Our Chapter</h2>
                        
                        {chapters.length === 0 && (
                            <p className={styles.reveal} style={{ textAlign: 'center' }}>
                                Belum ada chapter terdaftar.
                            </p>
                        )}

                        {chapters.map((chapter) => (
                            <div
                                key={chapter.id}
                                className={`${styles.chapterItem} ${styles.reveal}`}
                            >
                                <div className={styles.chapterLogo}>
                                    {/* [PENTING] Update Path Gambar:
                                        Menggunakan URL absolut ke server backend (/uploads/chapters/...)
                                    */}
                                    <img 
                                        src={`${SERVER_ROOT}/uploads/chapters/${chapter.img}`} 
                                        alt={`Logo ${chapter.name}`} 
                                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/100?text=No+Img')}
                                    />
                                </div>
                                <div
                                    className={styles.chapterContent}
                                    data-chapter={chapter.id}
                                >
                                    <h3>{chapter.name}</h3>
                                    <p>{chapter.description || 'Tidak ada deskripsi.'}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AboutPage;