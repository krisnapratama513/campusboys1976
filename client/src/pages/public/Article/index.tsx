// client/src/pages/public/Article/index.tsx

import styles from './ArticlePage.module.css';
import { useState, useEffect } from 'react';

// [PENTING] Import Config untuk akses URL Server
import { SERVER_ROOT } from '../../../config/api';

import ArticleCard from '../../../components/ArticleCard/ArticleCard';
import type { ApiArticleCard } from '../../../types/article.types';
import MediaHeroSection from '../../../components/MediaHeroSection';
import { getAllArticlesCard } from '../../../services/articleService';

/**
 * Halaman Arsip Artikel (Blog Index).
 * Menampilkan grid dari seluruh artikel yang berstatus 'publish'.
 * * @component
 */
const ArticlePage = () => {
    /** State penyimpanan data artikel */
    const [articles, setArticles] = useState<ApiArticleCard[]>([]);
    
    // const [loading, setLoading] = useState(true);

    /**
     * Effect: Fetch data semua artikel saat komponen di-mount.
     */
    useEffect(() => {
        getAllArticlesCard()
            .then(data => {
                setArticles(data);
                // setLoading(false);
            })
            .catch(err => {
                console.error("[ArticlePage] Fetch Error:", err);
                // setLoading(false);
            });
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <MediaHeroSection title='Article' />

            {/* Container Grid */}
            <main className={styles.gridContainer}>
                {articles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        href={`/article/${article.slug}`} // Link ke detail
                        
                        // [PENTING] Update Path Gambar:
                        // Gabungkan URL Server + Folder Uploads + Nama File
                        imgFilename={`${SERVER_ROOT}/uploads/articles/${article.img}`}
                        
                        author={article.author_name}
                        date={article.created_at}
                        title={article.title}
                        description={article.description}
                    />
                ))}

                {/* Tampilan jika data kosong */}
                {articles.length === 0 && (
                    <div style={{ color: '#94a3b8', textAlign: 'center', gridColumn: '1 / -1', padding: '50px' }}>
                        <p>Belum ada artikel yang tersedia saat ini.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ArticlePage;