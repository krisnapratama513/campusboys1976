// client/src/pages/public/Home/RecentArticleCarousel.tsx

import { useState, useEffect, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { ApiArticleCard } from '../../../types/article.types';
import { getRecentArticlesCard } from '../../../services/articleService';
import ArticleCard from '../../../components/ArticleCard/ArticleCard';
import GlassControlBtn from '../../../components/GlassControlBtn/GlassControlBtn';

// [PENTING] Import Config untuk akses URL Server
import { SERVER_ROOT } from '../../../config/api';

// --- STYLE DEFINITIONS ---
// Menggunakan CSS-in-JS untuk style yang terisolasi
const header: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    margin: '10px 0',
    color: 'rgb(236, 232, 225)',
};

const h2: CSSProperties = {
    fontFamily: "'Capture It', sans-serif",
    fontSize: '1.75rem',
    letterSpacing: '1.2px',
    marginBottom: '-5px',
    textShadow: '1px 1px 0px rgba(0, 0, 0, 0.4)'
};

const slidesWrapper: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    minHeight: '350px'
};

const carouselNavigation: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '30px'
};

/**
 * ==============================================================================
 * RECENT ARTICLES CAROUSEL
 * ==============================================================================
 * Komponen Carousel yang menampilkan 5 artikel terbaru.
 * * Fitur Utama:
 * 1. Fetching data artikel terbaru dari API.
 * 2. Responsif: Menampilkan 1, 2, atau 3 kartu tergantung lebar layar.
 * 3. Infinite Loop Navigation (Circular Buffer Logic).
 * * @component
 */
function RecentArticlesCarousel() {
    /** State: Menyimpan daftar artikel dari API */
    const [articles, setArticles] = useState<ApiArticleCard[]>([]);
    
    /** State: Indikator loading saat fetching data */
    const [loading, setLoading] = useState(true);
    
    /** State: Jumlah kartu yang ditampilkan per slide (Responsif) */
    const [cardsToShow, setCardsToShow] = useState(3);
    
    /** State: Pointer indeks artikel pertama yang sedang tampil */
    const [currentIndex, setCurrentIndex] = useState(0);

    /**
     * Effect 1: Fetch Data
     * Mengambil data artikel terbaru saat komponen dimuat (Mount).
     */
    useEffect(() => {
        getRecentArticlesCard()
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("[RecentArticleCarousel] Fetch Error:", err);
                setLoading(false);
            });
    }, []);

    /**
     * Effect 2: Handle Resize (Responsif JS)
     * Mengatur jumlah kartu yang tampil (cardsToShow) berdasarkan lebar window.
     * Diperlukan karena logika pemotongan array terjadi di JavaScript, bukan CSS.
     */
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width <= 600) {
                setCardsToShow(1); // Mobile
            } else if (width <= 900) {
                setCardsToShow(2); // Tablet
            } else {
                setCardsToShow(3); // Desktop
            }
        };

        // Inisialisasi awal & pasang listener
        handleResize();
        window.addEventListener('resize', handleResize);
        
        // Cleanup listener saat unmount (Mencegah memory leak)
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Style Grid Dinamis berdasarkan cardsToShow
    const slidesContainer: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${cardsToShow}, 1fr)`,
        gap: '20px'
    };

    /**
     * Handler: Geser Kiri (Previous).
     * Jika indeks < 0, putar balik ke elemen terakhir array.
     */
    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 < 0 ? articles.length - 1 : prev - 1));
    };

    /**
     * Handler: Geser Kanan (Next).
     * Menggunakan modulo (%) untuk kembali ke 0 jika mencapai akhir array.
     */
    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
    };

    /**
     * Logika Circular Buffer (Infinite Loop).
     * Memilih subset artikel dari array utama untuk ditampilkan.
     * Contoh: Jika array length 5, current 4, show 3 -> Ambil index [4, 0, 1].
     */
    const visibleArticles = [];
    if (articles.length > 0) {
        for (let i = 0; i < cardsToShow; i++) {
            const index = (currentIndex + i) % articles.length;
            visibleArticles.push(articles[index]);
        }
    }

    /**
     * Helper: URL Root Server.
     * Menghapus suffix '/api' dari BASE_URL untuk mendapatkan root domain.
     * Contoh: 'http://localhost:8000/api' -> 'http://localhost:8000'
     * Digunakan untuk mengakses folder statis '/uploads'.
     */

    // --- RENDER ---

    if (loading) {
        return (
            <article style={{ backgroundColor: 'rgb(15, 25, 35)', height: '400px' }}>
                <main className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
                    <div style={header}><h2 style={h2}>RECENT ARTICLES</h2></div>
                    <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
                        Memuat artikel...
                    </div>
                </main>
            </article>
        );
    }

    // Fallback jika database kosong
    if (articles.length === 0) return null;

    return (
        <article style={{ backgroundColor: 'rgb(15, 25, 35)', fontFamily: 'Roboto, sans-serif' }}>
            <main className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>

                {/* Header Section */}
                <div style={header}>
                    <h2 style={h2}>RECENT ARTICLES</h2>
                    <Link style={{ textDecoration: 'none', color: 'rgb(236, 232, 225)' }} to="/article">
                        GO TO ARTICLE PAGE
                    </Link>
                </div>

                {/* Carousel Slides */}
                <div style={slidesWrapper}>
                    <div style={slidesContainer}>
                        {visibleArticles.map((article, index) => (
                            // Key menggunakan kombinasi ID+index karena item yang sama 
                            // bisa muncul 2x di carousel (saat looping)
                            <ArticleCard
                                key={`${article.id}-${index}`} 
                                href={`/article/${article.slug}`}
                                // Construct Full URL: Server + Uploads Path + Filename
                                imgFilename={`${SERVER_ROOT}/uploads/articles/${article.img}`}
                                author={article.author_name}
                                date={article.created_at} 
                                title={article.title}
                                description={article.description}
                            />
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div style={carouselNavigation}>
                    <GlassControlBtn varian="left" onClick={handlePrevious} />

                    <GlassControlBtn varian="right" onClick={handleNext} />
                </div>

            </main>
        </article>
    );
}

export default RecentArticlesCarousel;