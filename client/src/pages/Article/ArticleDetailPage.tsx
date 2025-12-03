// client/src/pages/Article/ArticleDetailPage.tsx

import { useParams, Navigate, Link } from 'react-router-dom';
import { FaCalendarDays, FaRegUser } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import styles from './ArticleDetailPage.module.css';
import { formatWIBDate } from '../../utils/formatDate';

import type { ApiArticleCard, FullArticleDetail } from '../../types/article.types';


const ArticleDetailPage = () => {
    // Ambil slug dari URL untuk identifikasi artikel
    const { slug } = useParams<{ slug: string }>(); 
    
    // State utama untuk detail artikel yang sedang dilihat
    const [article, setArticle] = useState<FullArticleDetail | null>(null); 
    
    // State untuk status loading dan error
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null); 

    // State untuk daftar artikel terbaru
    // Asumsi endpoint /recent mengembalikan data yang cukup untuk di-filter menjadi 3
    const [recentArticles, setRecentArticles] = useState<ApiArticleCard[]>([]);



    /**
     * Efek untuk mengambil data artikel utama berdasarkan slug.
     */
    useEffect(() => {
        if (!slug) {
            setLoading(false);
            setError("Slug tidak valid.");
            return;
        }

        const fetchArticle = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch detail artikel
                const response = await fetch(`http://localhost:8000/api/articles/${slug}`);

                if (!response.ok) {
                    throw new Error('Artikel tidak ditemukan atau gagal mengambil data.');
                }

                const data: FullArticleDetail[] = await response.json();

                if (data.length > 0) {
                    setArticle(data[0]);
                } else {
                    setError("Artikel tidak ditemukan.");
                    setArticle(null);
                }
            } catch (err) {
                console.error("Fetch Article Error:", err);
                setError("Gagal memuat artikel. Coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]); // Dependensi pada slug agar di-fetch ulang saat navigasi internal


    /**
     * Efek untuk mengambil dan memproses daftar artikel terbaru.
     * Mengambil N data dan memfilter/memotong untuk mendapatkan 3 artikel unik.
     */
    useEffect(() => {
        const fetchRecentArticles = async () => {
            try {
                // Asumsi endpoint /recent mengembalikan data dengan LIMIT N (misal: 5)
                const response = await fetch(`http://localhost:8000/api/articles/recent`);

                if (!response.ok) {
                    console.error('Gagal mengambil artikel terbaru.');
                    return;
                }

                const data: ApiArticleCard[] = await response.json();
                
                // 1. Filter slug: Hapus artikel yang sedang dibuka dari daftar recent.
                const filteredBySlug = data.filter(item => item.slug !== slug);

                // 2. Slice: Batasi hasilnya menjadi 3 artikel pertama (untuk menjamin tampilan 3 item).
                const finalRecentArticles = filteredBySlug.slice(0, 3);

                setRecentArticles(finalRecentArticles);
            } catch (err) {
                console.error("Fetch Recent Articles Error:", err);
            }
        };

        fetchRecentArticles();
    }, [slug]);


    // Tampilkan status Loading
    if (loading) {
        return <div className={styles.articleDetailPageContainer}>Memuat Artikel...</div>;
    }

    // Tampilkan status Error / Arahkan ke halaman utama jika artikel tidak ditemukan
    if (error || !article) {
        return <Navigate to="/" replace />;
    }

    // Persiapan data untuk tampilan
    const imgPath = `/article/${article.img}`;
    const imgAlt = `poster ${article.title}`;
    const displayDate = formatWIBDate(article.created_at);


    // --- Render Komponen ---
    return (
        <div className={styles.fullContainer}>
            <div className={styles.hero} />

            <div className={styles.articleDetailPageContainer}>
                {/* Kolom Kiri: Konten Artikel Utama */}
                <article className={styles.articleContainer}>
                    <header className={styles.articleHeader}>
                        <h2 className={styles.articleTitle}>{article.title}</h2>
                        <img src={imgPath} alt={imgAlt} className={styles.heroImage} />
                        <div className={styles.wrapApaYa}>
                            <div className={styles.metaInfo}>
                                <span><FaRegUser /> <strong>{article.author_name}</strong></span>
                                <span><FaCalendarDays /> {displayDate}</span>
                            </div>
                            {/* Kode Slider Font Dihapus */}
                        </div>
                    </header>
                    <br />
                    {/* Render konten HTML, gunakan dangerouslySetInnerHTML dengan hati-hati */}
                    <div
                        className={styles.articleContent}
                        style={{ fontSize: `18px` }}
                        dangerouslySetInnerHTML={{ __html: article.content }} 
                    />
                </article>

                {/* Kolom Kanan: Daftar Artikel Terbaru */}
                <div className={styles.recentArticle}>
                    <h2>Recent Post</h2>
                    {recentArticles.length === 0 && <p>Tidak ada postingan terbaru.</p>}

                    {recentArticles.map((recent, index) => (
                        <div key={recent.id}>
                            <Link to={`/article/${recent.slug}`} className={styles.recentItem}>
                                <div className={styles.recentImg}>
                                    <img src={`/article/${recent.img}`} alt={recent.title} />
                                </div>
                                <div className={styles.recentBody}>
                                    <p>{recent.title}</p>
                                    <p style={{ fontSize: '13px' }}><FaCalendarDays /> {formatWIBDate(recent.created_at)}</p>
                                </div>
                            </Link>
                            {/* Pembatas antar item (dihilangkan untuk item terakhir) */}
                            {index < recentArticles.length - 1 && (
                                <><br /><hr /><br /></>
                            )}
                        </div>
                    ))}
                </div>
            </div >
        </div>
    );
};

export default ArticleDetailPage;