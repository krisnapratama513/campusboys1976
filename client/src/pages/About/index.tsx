// client/src/pages/About/index.tsx

import { useEffect, useRef, useState } from 'react';
import styles from './AboutPage.module.css';
import HeroSection from './HeroSection';

import { type AboutContent } from '../../types/about';
import type{ ApiChapter } from '../../types/chapter.types';
import { MOCK_aboutData } from '../../data/mockAbout';

const AboutPage = () => {
    const aboutData: AboutContent = MOCK_aboutData;
    const [chapters, setChapters] = useState<ApiChapter[]>([]);
    const mainRef = useRef<HTMLElement>(null);


    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/chapters');
                const data = await response.json();
                setChapters(data); // Simpan ke state
            } catch (error) {
                console.error("Gagal mengambil data chapter:", error);
            }
        };

        fetchChapters();
    },[]);



    // Efek untuk IntersectionObserver (animasi scroll)
    useEffect(() => {
        const revealElements = mainRef.current?.querySelectorAll(`.${styles.reveal}`);
        if (!revealElements) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.active);
                    }
                });
            },
            { threshold: 0.1 }
        );

        revealElements.forEach((el) => {
            observer.observe(el);
        });

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
                    <section className={styles.philosophy}>
                        <h2>{aboutData.judul}</h2>
                        {aboutData.paragraf.map((p, index) => (
                            <p key={index}>{p}</p>
                        ))}
                    </section>

                    <section className={styles.chaptersSection}>
                        <h2 className={styles.reveal}>Our Chapter</h2>
                        {chapters.map((chapter) => (
                            <div
                                key={chapter.id}
                                className={`${styles.chapterItem} ${styles.reveal}`}
                            >
                                <div className={styles.chapterLogo}>
                                    <img src={`chapter/${chapter.img}`} alt={`Logo ${chapter.name}`} />
                                </div>
                                <div
                                    className={styles.chapterContent}
                                    data-chapter={chapter.id}
                                >
                                    <h3>{chapter.name}</h3>
                                    <p>{chapter.description}</p>
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