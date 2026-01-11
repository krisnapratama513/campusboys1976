// client/src/pages/public/About/index.tsx

import { useEffect, useRef, useState } from 'react';
import styles from './AboutPage.module.css';
import HeroSection from './HeroSection';

import { type AboutContent } from '../../../types/about';
import type { Chapter } from '../../../types/chapter.types';
import { MOCK_aboutData } from '../../../data/mockAbout';
import { getChapters } from '../../../services/chapterService';

const AboutPage = () => {
    const aboutData: AboutContent = MOCK_aboutData;
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const mainRef = useRef<HTMLElement>(null);


    useEffect(() => {
        getChapters()
            .then(data => {
                setChapters(data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);



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
                                    <img 
                                    src={`/chapters/${chapter.img}`} 
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