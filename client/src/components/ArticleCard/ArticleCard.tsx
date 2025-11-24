// client/src/components/ArticleCard/ArticleCard.tsx
import styles from './ArticleCard.module.css';
import { Link } from 'react-router-dom';
import type { ArticleCardProps } from '../../types/article.types';

const ArticleCard = ({
    href,
    imgFilename,
    author,
    date,
    title,
    description
}: ArticleCardProps) => {

    // 1. Buat objek Date. String 'Z' (UTC) akan otomatis di-parse.
    const dateObj = new Date(date);

    // 2. Tentukan opsi format untuk WIB (Asia/Jakarta)
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta', // Penting untuk konversi ke WIB (UTC+7)
        day: '2-digit',           // "07"
        month: '2-digit',         // "03"
        year: 'numeric'           // "2020"
    };

    // 3. Format tanggal menggunakan 'id-ID' (Bahasa Indonesia)
    // Ini akan menghasilkan string "07/03/2020"
    const formattedDate = dateObj.toLocaleDateString('id-ID', options);
    
    // 4. Sesuaikan format agar memiliki spasi (sesuai permintaan Anda)
    // Mengubah "07/03/2020" menjadi "07 / 03 / 2020"
    const displayDate = formattedDate.replace(/\//g, ' / ');

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