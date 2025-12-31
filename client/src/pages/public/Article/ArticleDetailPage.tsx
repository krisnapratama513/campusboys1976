import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { FaCalendarDays, FaRegUser } from 'react-icons/fa6';

// Styles & Utils
import styles from './ArticleDetailPage.module.css';
import { formatWIBDate } from '../../../utils/formatDate';

// Services
import { getArticleBySlug, getRecentArticlesCard } from '../../../services/articleService';

// Types
import type { ApiArticleCard, FullArticleDetail } from '../../../types/article.types';

/**
 * ArticleDetailPage Component
 * * Responsible for displaying the full content of a single article based on the URL slug.
 * It also fetches and displays a list of recent articles in the sidebar, 
 * excluding the currently viewed article.
 */
const ArticleDetailPage = () => {
    // 1. Hooks & State Management
    const { slug } = useParams<{ slug: string }>();

    // Data State
    const [article, setArticle] = useState<FullArticleDetail | null>(null);
    const [recentArticles, setRecentArticles] = useState<ApiArticleCard[]>([]);

    // UI State
    const [loading, setLoading] = useState(true); // Controls the main page loader
    const [error, setError] = useState<string | null>(null);

    /**
     * Effect 1: Fetch Main Article
     * Triggered when 'slug' changes.
     * Handles the primary loading state of the page.
     */
    useEffect(() => {
        if (!slug) return;

        // Reset states on navigation
        setLoading(true);
        setError(null);

        getArticleBySlug(slug)
            .then((data) => {
                // Check if API returns valid data array
                if (data && data.length > 0) {
                    setArticle(data[0]);
                } else {
                    // Handle 404 case logically
                    setArticle(null);
                    setError("Article not found");
                }
            })
            .catch((err) => {
                console.error("[ArticleDetail] Failed to fetch article:", err);
                setArticle(null);
                setError("Internal Server Error");
            })
            .finally(() => {
                // Ensure loading is turned off regardless of success or failure
                setLoading(false);
            });

    }, [slug]);

    /**
     * Effect 2: Fetch Recent Articles (Sidebar)
     * Runs independently from the main article fetch.
     * Does NOT affect the main 'loading' state to prevent blocking the UI.
     */
    useEffect(() => {
        getRecentArticlesCard()
            .then((data) => {
                // Filter: Exclude the currently viewed article from the sidebar
                const otherArticles = data.filter((item) => item.slug !== slug);

                // Limit: Take only the top 3 items
                setRecentArticles(otherArticles.slice(0, 3));
            })
            .catch((err) => {
                // Silent failure: If sidebar fails, just log it, don't crash the page
                console.error("[ArticleDetail] Failed to fetch recent posts:", err);
            });
    }, [slug]);

    // 2. Render Logic: Loading State
    if (loading) {
        // TODO: Replace with a Skeleton Loader component for better UX
        return (
            <div className={styles.articleDetailPageContainer}>
                <p>Memuat Artikel...</p>
            </div>
        );
    }

    // 3. Render Logic: Error / Not Found Handling
    // If loading is done but article is missing, redirect to Home
    if (error || !article) {
        return <Navigate to="/" replace />;
    }

    // 4. Data Formatting
    const imgPath = `/article/${article.img}`;
    const displayDate = formatWIBDate(article.created_at);

    return (
        <div className={styles.fullContainer}>
            <div className={styles.hero} />

            <div className={styles.articleDetailPageContainer}>
                {/* LEFT COLUMN: Main Content */}
                <article className={styles.articleContainer}>
                    <header className={styles.articleHeader}>
                        <h2 className={styles.articleTitle}>{article.title}</h2>

                        <img
                            src={imgPath}
                            alt={`Poster ${article.title}`}
                            className={styles.heroImage}
                            loading="eager" // Priority loading for LCP
                        />

                        <div className={styles.wrapApaYa}>
                            <div className={styles.metaInfo}>
                                <span>
                                    <FaRegUser /> <strong>{article.author_name}</strong>
                                </span>
                                <span>
                                    <FaCalendarDays /> {displayDate}
                                </span>
                            </div>
                        </div>
                    </header>

                    <br />

                    {/* Content Body */}
                    {/* SECURITY NOTE: Ensure backend sanitizes 'content' to prevent XSS */}
                    <div
                        className={styles.articleContent}
                        style={{ fontSize: `18px` }}
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </article>

                {/* RIGHT COLUMN: Sidebar (Recent Posts) */}
                <aside className={styles.recentArticle}>
                    <h2>Recent Post</h2>

                    {recentArticles.length === 0 && (
                        <p className={styles.emptyText}>Tidak ada postingan terbaru.</p>
                    )}

                    {recentArticles.map((recent, index) => (
                        <div key={recent.id}>
                            <Link to={`/article/${recent.slug}`} className={styles.recentItem}>
                                <div className={styles.recentImg}>
                                    <img
                                        src={`/article/${recent.img}`}
                                        alt={recent.title}
                                        loading="lazy"
                                    />
                                </div>
                                <div className={styles.recentBody}>
                                    <p className={styles.recentTitle}>{recent.title}</p>
                                    <p style={{ fontSize: '13px', color: '#888' }}>
                                        <FaCalendarDays /> {formatWIBDate(recent.created_at)}
                                    </p>
                                </div>
                            </Link>

                            {/* Divider: Only render if not the last item */}
                            {index < recentArticles.length - 1 && (
                                <><br /><hr /><br /></>
                            )}
                        </div>
                    ))}
                </aside>
            </div>
        </div>
    );
};

export default ArticleDetailPage;