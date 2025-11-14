import styles from './ArticlePage.module.css';

// 1. Impor semua data artikel
import { mockArticles } from '../../data/mockArticles';

// 2. Impor komponen ArticleCard Anda
// (Sesuaikan path ini jika ArticleCard.tsx Anda ada di folder lain)
// import ArticleCard from '../../components/ArticleCard';
import ArticleCard from '../../components/ArticleCard/ArticleCard';

const ArticlePage = () => {
    return (
        <div className={styles.pageWrapper}>

            {/* Header Halaman */}
            <header className={styles.heroSection}>
                <h1>Artikel</h1>
            </header>

            {/* 3. Grid untuk menampilkan semua kartu artikel */}
            <main className={styles.gridContainer}>
                {mockArticles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        href={`/article/${article.slug}`} // Path ke halaman detail
                        imgFilename={article.imgFilename}
                        // imgAlt={article.imgAlt}
                        author={article.author}
                        date={article.date}
                        title={article.title}
                        description={article.description}
                    />
                ))}
            </main>

        </div>
    );
};

export default ArticlePage;