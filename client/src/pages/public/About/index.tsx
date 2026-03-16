// client/src/pages/public/About/index.tsx

import styles from './AboutPage.module.css';
import HeroSection from './HeroSection';
import StatusView from '../../../components/StatusView';
import { SafeImage } from '../../../components/SafeImage';
import { RevealWrapper } from '../../../components/RevealWrapper';

import { SERVER_ROOT } from '../../../config/api';
import { useChapters } from '../../../hooks/useChapters';
import { type AboutContent } from '../../../types/about';
import { MOCK_aboutData } from '../../../data/mockAbout';

/**
 * Komponen Halaman About (Tentang Kami).
 * * Bertanggung jawab merender filosofi komunitas (statis) dan 
 * daftar chapter yang di-fetch secara dinamis dari API.
 * Dilengkapi dengan penanganan state (loading/error) dan animasi scroll.
 * * @component
 * @returns {JSX.Element} Tampilan antarmuka halaman About.
 */
const AboutPage = () => {
    const aboutData: AboutContent = MOCK_aboutData;
    const { chapters, loading, error } = useChapters();

    return (
        <div className={styles.aboutPageWrapper}>
            <HeroSection />

            <div className={styles.container}>
                <main>
                    {/* Section: Filosofi */}
                    <section className={styles.philosophy}>
                        <h2>{aboutData.judul}</h2>
                        {aboutData.paragraf.map((p, index) => (
                            <p key={index}>{p}</p>
                        ))}
                    </section>

                    {/* Section: Daftar Chapter */}
                    <section className={styles.chaptersSection}>
                        <RevealWrapper>
                            <h2>Our Chapter</h2>
                        </RevealWrapper>
                        
                        {loading && <StatusView message="Memuat chapter..." />}
                        {error && <StatusView message={error} isError />}
                        {!loading && !error && chapters.length === 0 && (
                            <StatusView message="Belum ada chapter terdaftar." />
                        )}

                        {!loading && chapters.map((chapter) => (
                            <RevealWrapper 
                                key={chapter.id} 
                                className={styles.chapterItem}
                            >
                                <div className={styles.chapterLogo}>
                                    <SafeImage 
                                        src={`${SERVER_ROOT}/uploads/chapters/${chapter.img}`} 
                                        alt={`Logo ${chapter.name}`} 
                                    />
                                </div>
                                <div className={styles.chapterContent} data-chapter={chapter.id}>
                                    <h3>{chapter.name}</h3>
                                    <p>{chapter.description || 'Tidak ada deskripsi.'}</p>
                                </div>
                            </RevealWrapper>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AboutPage;