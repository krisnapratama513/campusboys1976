// client/src/pages/public/PhotoDetail/index.tsx

import styles from './PhotoDetail.module.css';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Config & Components
import { SERVER_ROOT } from '@/config/api';
import PhotoModal from '@/components/PhotoModal';
import StatusView from '@/components/StatusView';
import { SafeImage } from '@/components/SafeImage';
import { usePublicAlbumBySlug } from '@/hooks/usePublicAlbumBySlug';


const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

const PhotoDetail = () => {
    // Ambil slug dari URL
    const { slug } = useParams<{ slug: string }>();
    const { album, loading, error } = usePublicAlbumBySlug(slug);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);


    if (loading) return <StatusView message="Memuat detail album..." />;
    if (error) return <StatusView message={error} isError />;
    
    // --- RENDER 404 ---
    if (!album) return (
        <div className={styles.container}>
            <div className={styles.centerText}>
                <h3>Album tidak ditemukan</h3>
                <Link to="/photo" className={styles.backButton}>&larr; Kembali ke Galeri</Link>
            </div>
        </div>
    );

    const photos = album.photos || [];

    return (
        <>
            <div className={styles.container}>
                {/* Navigasi Balik */}
                <div className={styles.navBar}>
                    <Link to="/photo" className={styles.backButton}>
                        &larr; Kembali ke Album
                    </Link>
                </div>

                {/* Header Album */}
                <header className={styles.header}>
                    <span className={styles.date}>{formatDate(album.date)}</span>
                    <h1 className={styles.title}>{album.title}</h1>
                    <p className={styles.description}>{album.description || 'Tidak ada deskripsi.'}</p>
                </header>

                <hr className={styles.divider} />

                {/* Grid Foto Gallery */}
                <div className={styles.photoGrid}>
                    {photos.length === 0  ? (
                        <p style={{color:'#94a3b8', fontStyle:'italic', width:'100%', textAlign:'center'}}>
                            Belum ada foto di album ini.
                        </p>
                    ) : (
                        photos.map((photo) => (
                            <div 
                                key={photo.id} 
                                className={styles.photoItem}
                                onClick={() => setSelectedPhoto(photo.image_filename)}
                                style={{cursor: 'pointer'}}
                                title="Klik untuk memperbesar"
                            >
                                <SafeImage
                                    src={`${SERVER_ROOT}/uploads/albums/gallery/${photo.image_filename}`} 
                                    alt={`Dokumentasi ${album.title}`} 
                                    className={styles.image}
                                    loading="lazy"
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Component Modal (Popup) */}
            <PhotoModal 
                imageFilename={selectedPhoto} 
                onClose={() => setSelectedPhoto(null)} 
            />
        </>
    );
};

export default PhotoDetail;