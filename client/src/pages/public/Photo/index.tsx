// client/src/pages/public/Photo/index.tsx

import styles from './Photo.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePublicAlbums } from '@/hooks/usePublicAlbums';

import MediaHeroSection from '@/components/MediaHeroSection';
import Pagination from '@/components/Pagination';
import StatusView from '@/components/StatusView';
import { SafeImage } from '@/components/SafeImage';

import { SERVER_ROOT } from '@/config/api';


const PhotoPage = () => {
    const [page, setPage] = useState(1);
    const { albums, totalPages, loading, error } = usePublicAlbums(page);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className={styles.pageContainer}>
            <MediaHeroSection title='Photo Album' />

            <div className={styles.contentWrapper}>
                {loading && <StatusView message="Memuat album..." />}
                {error && <StatusView message={error} isError />}
                {!loading && !error && albums.length === 0 && (
                    <StatusView message="Belum ada album foto." />
                )}
                
                {!loading && !error && albums.length > 0 && (
                    <>
                        <div className={styles.grid}>
                            {albums.map((album) => (
                                <Link to={`/photo/${album.name}`} key={album.id} className={styles.cardLink}>
                                    <div className={styles.card}>
                                        <div className={styles.imageWrapper}>
                                            <SafeImage 
                                                src={`${SERVER_ROOT}/uploads/albums/covers/${album.image}`} 
                                                alt={album.title} 
                                                className={styles.image}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className={styles.cardBody}>
                                            <span className={styles.date}>{formatDate(album.date)}</span>
                                            <h3 className={styles.title}>{album.title}</h3>
                                            <p className={styles.description}>
                                                {album.description?.length > 100 
                                                    ? `${album.description.substring(0, 100)}...` 
                                                    : (album.description || 'Tidak ada deskripsi.')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default PhotoPage;