import styles from './ArticlePage.module.css';
import { useState, useEffect } from 'react';

import { SERVER_ROOT } from '../../../config/api';
import ArticleCard from '../../../components/ArticleCard/ArticleCard';
import type { ApiArticleCard } from '../../../types/article.types';
import MediaHeroSection from '../../../components/MediaHeroSection';
import { getAllArticlesCard } from '../../../services/articleService';

// [TAMBAHAN] Import komponen Pagination
import Pagination from '../../../components/Pagination';

const ArticlePage = () => {
    const [articles, setArticles] = useState<ApiArticleCard[]>([]);
    
    // [TAMBAHAN] State untuk loading dan pagination
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setLoading(true); // Mulai loading setiap pindah halaman
        
        getAllArticlesCard(page) // Kirim parameter page
            .then(res => {
                // Sekarang res memiliki struktur { data, pagination }
                setArticles(res.data);
                setTotalPages(res.pagination.totalPages);
                setLoading(false);
            })
            .catch(err => {
                console.error("[ArticlePage] Fetch Error:", err);
                setLoading(false);
            });
    }, [page]); // useEffect dipicu ulang setiap kali 'page' berubah

    return (
        <div className={styles.pageWrapper}>
            <MediaHeroSection title='Articles' />

            <main className={styles.gridContainer}>
                {/* [TAMBAHAN] Tampilkan pesan loading */}
                {loading ? (
                    <div style={{ color: '#94a3b8', textAlign: 'center', gridColumn: '1 / -1', padding: '50px' }}>
                        <p>Memuat artikel...</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div style={{ color: '#94a3b8', textAlign: 'center', gridColumn: '1 / -1', padding: '50px' }}>
                        <p>Belum ada artikel yang tersedia saat ini.</p>
                    </div>
                ) : (
                    <>
                        {/* Grid Artikel */}
                        {articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                href={`/article/${article.slug}`}
                                imgFilename={`${SERVER_ROOT}/uploads/articles/${article.img}`}
                                author={article.author_name}
                                date={article.created_at}
                                title={article.title}
                                description={article.description}
                            />
                        ))}
                    </>
                )}
            </main>

            {/* [TAMBAHAN] Pasang komponen Pagination di luar / di bawah grid */}
            {!loading && articles.length > 0 && (
                <div style={{ paddingBottom: '40px' }}>
                    <Pagination 
                        currentPage={page} 
                        totalPages={totalPages} 
                        onPageChange={(newPage) => setPage(newPage)} 
                    />
                </div>
            )}
            
        </div>
    );
};

export default ArticlePage;