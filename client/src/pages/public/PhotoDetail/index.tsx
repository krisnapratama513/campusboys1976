// client/src/pages/PhotoDetail/index.tsx

import styles from './PhotoDetail.module.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Gunakan tipe 'Album' yang sudah disatukan
import type { Album } from '../../../types/album.types';
// Gunakan service khusus public by Slug
import { getPublicAlbumBySlug } from '../../../services/albumService';

// Import Komponen Baru
import PhotoModal from '../../../components/PhotoModal';

const PhotoDetail = () => {
    // Ubah parameter dari 'id' menjadi 'slug'
    const { slug } = useParams<{ slug: string }>();
    
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);
    
    // State Modal
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            getPublicAlbumBySlug(slug)
                .then(data => {
                    setAlbum(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Gagal load detail album:", err);
                    setLoading(false);
                });
        }
    }, [slug]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    if (loading) return <div className={styles.centerText}>Memuat foto...</div>;
    
    // Tampilan jika album tidak ditemukan / slug salah
    if (!album) return (
        <div className={styles.container}>
            <div className={styles.centerText}>
                <h3>Album tidak ditemukan</h3>
                <Link to="/photo" className={styles.backButton}>&larr; Kembali ke Galeri</Link>
            </div>
        </div>
    );

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
                    {/* Gunakan (album.photos || []) untuk keamanan jika photos undefined */}
                    {(album.photos || []).length === 0 ? (
                        <p style={{color:'#94a3b8', fontStyle:'italic'}}>Belum ada foto di album ini.</p>
                    ) : (
                        (album.photos || []).map((photo) => (
                            <div 
                                key={photo.id} 
                                className={styles.photoItem}
                                onClick={() => setSelectedPhoto(photo.image_filename)}
                                style={{cursor: 'pointer'}}
                            >
                                <img 
                                    src={`/albums/gallery/${photo.image_filename}`} 
                                    alt={`Dokumentasi ${album.title}`} 
                                    className={styles.image}
                                    loading="lazy"
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Component Modal */}
            <PhotoModal 
                imageFilename={selectedPhoto} 
                onClose={() => setSelectedPhoto(null)} 
            />
        </>
    );
};

export default PhotoDetail;