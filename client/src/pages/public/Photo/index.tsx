// clinet/src/pages/Photo/index.tsx

import styles from './Photo.module.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Pastikan install react-router-dom
import type { AlbumListItem } from '../../../types/album.types';
import MediaHeroSection from '../../../components/MediaHeroSection';
import { getAlbums } from '../../../services/albumService';

const PhotoPage = () => {
    const [albums, setAlbums] = useState<AlbumListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAlbums()
            .then(data => {
                setAlbums(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Helper untuk format tanggal: "2018-11-10" -> "10 Nov 2018"
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className={styles.pageContainer}>
            <MediaHeroSection title='Photo Album' />

            <div className={styles.contentWrapper}>
                {loading ? (
                    <p className={styles.loadingText}>Memuat album...</p>
                ) : (
                    <div className={styles.grid}>
                        {albums.map((album) => (
                            <Link to={`/photo/${album.id}`} key={album.id} className={styles.cardLink}>
                                <div className={styles.card}>
                                    {/* Image Wrapper untuk rasio tetap */}
                                    <div className={styles.imageWrapper}>
                                        <img 
                                            src={`/album/0-cover/${album.image}`} 
                                            alt={album.title} 
                                            className={styles.image}
                                            loading="lazy"
                                        />
                                        <div className={styles.overlay}></div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className={styles.cardBody}>
                                        <span className={styles.date}>{formatDate(album.date)}</span>
                                        <h3 className={styles.title}>{album.title}</h3>
                                        <p className={styles.description}>
                                            {album.description || 'Tidak ada deskripsi.'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoPage;