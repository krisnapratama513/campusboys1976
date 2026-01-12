// client/src/pages/public/PhotoDetail/index.tsx

import styles from './PhotoDetail.module.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Types & Services
import type { Album } from '../../../types/album.types';
import { getPublicAlbumBySlug } from '../../../services/albumService';

// Config & Components
import { API_BASE_URL } from '../../../config/api'; // [PENTING]
import PhotoModal from '../../../components/PhotoModal';

/**
 * Halaman Public: Detail Album.
 * Menampilkan grid foto dari album tertentu.
 * Mengambil gambar dari server uploads dan menangani logika Modal Zoom.
 * * @component
 */
const PhotoDetail = () => {
    // Ambil slug dari URL
    const { slug } = useParams<{ slug: string }>();
    
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);
    
    // State untuk Modal (menyimpan filename foto yang sedang di-zoom)
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    // Helper: Root URL Server (hapus '/api')
    const serverRoot = API_BASE_URL.replace('/api', '');

    /**
     * Effect: Load Detail Album by Slug
     */
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

    // Format Tanggal (Indonesia)
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // --- RENDER LOADING ---
    if (loading) return <div className={styles.centerText}>Memuat foto...</div>;
    
    // --- RENDER 404 ---
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
                    {(album.photos || []).length === 0 ? (
                        <p style={{color:'#94a3b8', fontStyle:'italic', width:'100%', textAlign:'center'}}>
                            Belum ada foto di album ini.
                        </p>
                    ) : (
                        (album.photos || []).map((photo) => (
                            <div 
                                key={photo.id} 
                                className={styles.photoItem}
                                onClick={() => setSelectedPhoto(photo.image_filename)}
                                style={{cursor: 'pointer'}}
                                title="Klik untuk memperbesar"
                            >
                                {/* [UPDATE] Gunakan URL Server */}
                                <img 
                                    src={`${serverRoot}/uploads/albums/gallery/${photo.image_filename}`} 
                                    alt={`Dokumentasi ${album.title}`} 
                                    className={styles.image}
                                    loading="lazy"
                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400?text=Error')}
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