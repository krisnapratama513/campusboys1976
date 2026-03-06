// client/src/pages/public/Photo/index.tsx

import styles from './Photo.module.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Type & Service
import type { Album } from '../../../types/album.types'; 
import MediaHeroSection from '../../../components/MediaHeroSection';
import { getPublicAlbums } from '../../../services/albumService'; 

// [PENTING] Import Config untuk akses Server Static Files
import { SERVER_ROOT } from '../../../config/api';

import Pagination from '../../../components/Pagination';

const PhotoPage = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    // [UPDATE 1] Tambahkan state untuk pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // [UPDATE 2] Ubah useEffect untuk menerima perubahan 'page'
    useEffect(() => {
        setLoading(true); // Aktifkan loading setiap kali pindah halaman
        
        getPublicAlbums(page) // Kirim parameter page
            .then(res => {
                // Sekarang response-nya mengandung 'data' dan 'pagination' (sesuai update service sebelumnya)
                setAlbums(res.data);
                setTotalPages(res.pagination.totalPages); 
                setLoading(false);
            })
            .catch(err => {
                console.error("Gagal load album:", err);
                setLoading(false);
            });
    }, [page]); // Masukkan 'page' ke dalam dependency array agar useEffect jalan ulang saat halaman berganti

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className={styles.pageContainer}>
            <MediaHeroSection title='Photo Album' />

            <div className={styles.contentWrapper}>
                {loading ? (
                    <div style={{textAlign:'center', padding: 50, color: '#94a3b8'}}>Memuat album...</div>
                ) : albums.length === 0 ? (
                    <div style={{textAlign:'center', padding: 50, color: '#94a3b8'}}>Belum ada album foto.</div>
                ) : (
                    // [UPDATE 3] Bungkus grid dan Pagination menggunakan Fragment (<>) 
                    <>
                        <div className={styles.grid}>
                            {albums.map((album) => (
                                <Link to={`/photo/${album.name}`} key={album.id} className={styles.cardLink}>
                                    <div className={styles.card}>
                                        
                                        {/* Image Wrapper */}
                                        <div className={styles.imageWrapper}>
                                            <img 
                                                src={`${SERVER_ROOT}/uploads/albums/covers/${album.image}`} 
                                                alt={album.title} 
                                                className={styles.image}
                                                loading="lazy"
                                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=No+Cover')}
                                            />
                                        </div>
                                        
                                        {/* Content */}
                                        <div className={styles.cardBody}>
                                            <span className={styles.date}>{formatDate(album.date)}</span>
                                            <h3 className={styles.title}>{album.title}</h3>
                                            <p className={styles.description}>
                                                {album.description 
                                                    ? (album.description.length > 100 ? album.description.substring(0, 100) + '...' : album.description) 
                                                    : 'Tidak ada deskripsi.'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* [UPDATE 4] Panggil Komponen Pagination di sini */}
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={(newPage) => setPage(newPage)} 
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default PhotoPage;