import styles from './PhotoDetail.module.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { AlbumDetail } from '../../../types/album.types';
import { getAlbumById } from '../../../services/albumService';

// Import Komponen Baru
import PhotoModal from '../../../components/PhotoModal';

const PhotoDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [album, setAlbum] = useState<AlbumDetail | null>(null);
    const [loading, setLoading] = useState(true);
    
    // State Modal
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            getAlbumById(id)
                .then(data => {
                    setAlbum(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    if (loading) return <div className={styles.centerText}>Memuat foto...</div>;
    if (!album) return <div className={styles.centerText}>Album tidak ditemukan</div>;

    return (
        <>
            <div className={styles.container}>
                <div className={styles.navBar}>
                    <Link to="/photo" className={styles.backButton}>
                        &larr; Kembali ke Album
                    </Link>
                </div>

                <header className={styles.header}>
                    <span className={styles.date}>{formatDate(album.date)}</span>
                    <h1 className={styles.title}>{album.title}</h1>
                    <p className={styles.description}>{album.description || 'Tidak ada deskripsi.'}</p>
                </header>

                <hr className={styles.divider} />

                <div className={styles.photoGrid}>
                    {album.photos.map((photo) => (
                        <div 
                            key={photo.id} 
                            className={styles.photoItem}
                            onClick={() => setSelectedPhoto(photo.image_filename)}
                        >
                            <img 
                                src={`/album/${photo.image_filename}`} 
                                alt={`Dokumentasi ${album.title}`} 
                                className={styles.image}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Panggil Component Modal di sini */}
            {/* Logic render sudah dihandle di dalam komponen (if !image return null) */}
            <PhotoModal 
                imageFilename={selectedPhoto} 
                onClose={() => setSelectedPhoto(null)} 
            />
        </>
    );
};

export default PhotoDetail;