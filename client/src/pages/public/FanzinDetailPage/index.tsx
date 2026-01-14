// client/src/pages/FanzinDetailPage/index.tsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 

// Komponen
import FlipbookViewer from '../../../components/FlipbookViewer';

// Service, Type & Config
import { getFanzineBySlug } from '../../../services/fanzineService';
import type { FanzineType } from '../../../types/fanzine.types';
import { SERVER_ROOT } from '../../../config/api'; 

// Style
import styles from './FanzinDetailPage.module.css';

/**
 * Halaman Detail Fanzine (Flipbook View).
 * Mengambil file PDF dari server backend (/uploads/fanzines).
 * * @component
 */
const FanzinDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();

    // [UPDATE] Mengubah nama state dari 'magazine' menjadi 'fanzine'
    const [fanzine, setFanzine] = useState<FanzineType | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    /**
     * Effect: Fetch Data
     */
    useEffect(() => {
        if (!slug) return;

        setIsLoading(true);
        
        getFanzineBySlug(slug)
            .then((data) => {
                setFanzine(data); // [UPDATE] setFanzine
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("[FanzineDetail] Error:", err);
                setIsLoading(false);
            });
    }, [slug]);

    // --- RENDER LOADING ---
    if (isLoading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.heroSpacer} />
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '5rem 0' }}>
                    Memuat Fanzine...
                </div>
            </div>
        );
    }

    // --- RENDER 404 ---
    // [UPDATE] Cek fanzine
    if (!fanzine) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.heroSpacer} />
                <div style={{ textAlign: 'center', color: '#ef4444', padding: '5rem 0' }}>
                    <h2 style={{fontSize: '2rem'}}>404</h2>
                    <p>Fanzine tidak ditemukan atau telah dihapus.</p>
                    <Link to="/fanzine" style={{ color: '#38bdf8', marginTop: '1rem', display: 'inline-block' }}>
                        Kembali ke Galeri
                    </Link>
                </div>
            </div>
        );
    }

    // --- SETUP URL PDF (BACKEND STORAGE) ---
    // [UPDATE] Menggunakan fanzine.pdfFilename
    const fullPdfPath = `${SERVER_ROOT}/uploads/fanzines/${fanzine.pdfFilename}`;

    // Format Tanggal
    // [UPDATE] Menggunakan fanzine.date
    const formattedDate = new Date(fanzine.date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className={styles.pageWrapper}>
            {/* Spacer Navigasi */}
            <div className={styles.heroSpacer} />

            <div className={styles.contentContainer}>
                
                {/* Header Info */}
                <div className={styles.header}>
                    <Link to="/fanzine" className={styles.backLink}>&larr; Kembali</Link>
                    
                    {/* [UPDATE] Menggunakan fanzine.title */}
                    <h1 className={styles.title}>{fanzine.title}</h1>
                    <p className={styles.meta}>
                        {/* [UPDATE] Menggunakan fanzine.author_name */}
                        Diterbitkan {formattedDate} | Oleh <strong>{fanzine.author_name}</strong>
                    </p>
                </div>

                {/* Flipbook Viewer */}
                <div className={styles.flipbookWrapper}>
                    <FlipbookViewer 
                        pdfUrl={fullPdfPath}
                        className="shadow-2xl" 
                    />
                </div>
            </div>
        </div>
    );
};

export default FanzinDetailPage;