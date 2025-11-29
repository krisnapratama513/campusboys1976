// client/src/components/ArticleCard/ArticleCard.tsx

import styles from './ArticleCard.module.css';
import { Link } from 'react-router-dom';
import type { ArticleCardProps } from '../../types/article.types';
import { formatWIBDate } from '../../utils/formatDate';

const ArticleCard = ({
    href,
    imgFilename,
    author,
    date,
    title,
    description
}: ArticleCardProps) => {

    const displayDate = formatWIBDate(date);
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
                        <div className={styles.cardDate}>{displayDate}</div>
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