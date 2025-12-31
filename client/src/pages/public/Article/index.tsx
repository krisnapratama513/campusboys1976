// client/src/pages/article/index.tsx
import styles from './ArticlePage.module.css';
import { useState, useEffect } from 'react';
import ArticleCard from '../../../components/ArticleCard/ArticleCard';
import type { ApiArticleCard } from '../../../types/article.types';
import MediaHeroSection from '../../../components/MediaHeroSection';
import { getAllArticlesCard } from '../../../services/articleService';

const ArticlePage = () => {
    const [articles, setArticles] = useState<ApiArticleCard[]>([]);
    // State untuk melacak status loading
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllArticlesCard()
            .then(data => {
                setArticles(data);
                // setLoading(false);
            })
            .catch(err => {
                console.error(err);
                // setLoading(false);
            });
    }, []);
    return (
        <div className={styles.pageWrapper}>
            <MediaHeroSection title='Article' />

            {/* loading nanti menunggu component */}
            <main className={styles.gridContainer}>
                {articles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        href={`/article/${article.slug}`} // Path ke halaman detail
                        imgFilename={article.img}
                        author={article.author_name}
                        date={article.created_at}
                        title={article.title}
                        description={article.description}
                    />
                ))}
            </main>

        </div>
    );
};

export default ArticlePage;