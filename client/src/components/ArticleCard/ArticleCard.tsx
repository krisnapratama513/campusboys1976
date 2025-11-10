// client/src/components/ArticleCard/ArticleCard.tsx

import styles from './ArticleCard.module.css';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ArticleCardProps = {
    href: string;
    imgFilename: string;
    author: string;
    date: string;
    title: string;
    description: ReactNode; // Gunakan ReactNode agar bisa memuat <br />
};

const ArticleCard = ({
    href,
    imgFilename,
    author,
    date,
    title,
    description
}: ArticleCardProps) => {

    const fullImgPath = `/article/${imgFilename}`;
    const imgAlt = `poster ${title}`;
    return (
        <article className={styles.articleCard}>
            <Link to={href} className={styles.link} >
                <div className={styles.cardImage}>
                    <img src={fullImgPath} alt={imgAlt} className={styles.image} />
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardAuthor}>{author}</div>
                        <div className={styles.cardDate}>{date}</div>
                    </div>
                    <div className={styles.cardTitle}>{title}</div>
                    <div className={styles.cardDescription}>
                        {description}
                    </div>
                </div>
            </Link>
        </article>
    )
}

export default ArticleCard;