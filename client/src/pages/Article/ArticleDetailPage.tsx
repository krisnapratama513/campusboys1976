// client/src/pages/Article/ArticleDetailPage.tsx

import { useParams, Navigate } from 'react-router-dom';
import { FaCalendarDays, FaRegUser } from 'react-icons/fa6';
import styles from './ArticleDetailPage.module.css';
import { useState, useEffect } from 'react'; // Tambahkan useEffect
import SliderFontSize from '../../components/SliderFontSize';

// Definisikan tipe untuk detail artikel lengkap
// Sesuaikan dengan respons JSON dari backend Anda (termasuk 'content')
interface FullArticleDetail {
    id: number;
    slug: string;
    img: string;
    title: string;
    created_at: string;
    content: string; // Konten lengkap (HTML/string)
    author_name: string; // Sesuaikan dengan key 'author_name' dari API
}

const ArticleDetailPage = () => {
    const { slug } = useParams<{ slug: string }>(); // Dapatkan slug
    const [article, setArticle] = useState<FullArticleDetail | null>(null); // State data artikel
    const [loading, setLoading] = useState(true); // State loading
    const [error, setError] = useState<string | null>(null); // State error
    const [fontSize, setFontSize] = useState(16);

    // --- Efek untuk Mengambil Data Artikel ---
    useEffect(() => {
        // Hanya jalankan jika slug ada
        if (!slug) {
            setLoading(false);
            setError("Slug tidak valid.");
            return;
        }

        const fetchArticle = async () => {
            setLoading(true);
            setError(null);
            try {
                // Panggil endpoint API yang Anda buat
                const response = await fetch(`http://localhost:8000/api/articles/${slug}`);

                if (!response.ok) {
                    throw new Error('Artikel tidak ditemukan atau gagal mengambil data.');
                }

                // Respons API Anda mengembalikan array dengan 1 objek, kita ambil objek pertamanya
                const data: FullArticleDetail[] = await response.json();

                if (data.length > 0) {
                    // Set data artikel dari elemen pertama array
                    setArticle(data[0]);
                } else {
                    // Jika array kosong (artikel tidak ditemukan)
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
    }, [slug]); // Rerun effect jika slug berubah
    // ------------------------------------------

    const handleSliderChange = (newValue: number) => {
        setFontSize(newValue);
    };

    // 1. Tampilkan status Loading
    if (loading) {
        return <div className={styles.articleDetailPageContainer}>Memuat Artikel...</div>;
    }

    // 2. Tampilkan status Error / Tidak Ditemukan
    if (error || !article) {
        // Jika terjadi error atau artikel tidak ditemukan, arahkan ke halaman utama atau tampilkan pesan 404
        return <Navigate to="/" replace />;
        // return <div className={styles.articleDetailPageContainer}>Artikel tidak ditemukan (404).</div>
    }

    // Path ke gambar (di public/img/article/) - Menggunakan 'img' dari API
    const imgPath = `/article/${article.img}`;
    const imgAlt = `poster ${article.title}`;

    // --- Tampilan Normal ---
    return (
        <div className={styles.fullContainer}>
            <div className={styles.hero}>

            </div>

            <div className={styles.articleDetailPageContainer}>
                <article className={styles.articleContainer}>
                    <header className={styles.articleHeader}>
                        <h2 className={styles.articleTitle}>{article.title}</h2>
                        <img src={imgPath} alt={imgAlt} className={styles.heroImage} />
                        <div className={styles.wrapApaYa}>
                            <div className={styles.metaInfo}>
                                {/* Gunakan author_name dari API */}
                                <span><FaRegUser /> <strong>{article.author_name}</strong></span>
                                {/* Gunakan created_at dari API */}
                                <span><FaCalendarDays /> {article.created_at}</span> <br />
                            </div>
                            <div className={styles.sliderFontSize}>
                                <span>Font Size : {fontSize}</span>
                                <SliderFontSize
                                    value={fontSize}
                                    onChange={handleSliderChange}
                                />
                            </div>
                        </div>
                    </header>
                    <br />
                    {/* Konten dimuat sebagai string HTML dari API. 
                  Gunakan dangerouslySetInnerHTML jika konten sudah aman dan terverifikasi di backend.
                  ATAU
                  Gunakan library seperti 'dompurify' untuk membersihkan konten sebelum ditampilkan.
                */}
                    <div
                        className={styles.articleContent}
                        style={{ fontSize: `${fontSize}px` }}
                        dangerouslySetInnerHTML={{ __html: article.content }} // KONTEN UTAMA
                    />
                </article>
                <div className={styles.rencetArticle}>
                    <h2>Recent Post</h2>
                </div>
            </div >
        </div>

    );
};

export default ArticleDetailPage;