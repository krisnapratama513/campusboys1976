// client/src/pages/MagazineDetailPage/index.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Komponen
import FlipbookViewer from '../../../components/FlipbookViewer';

// Service & Type
import { getFanzineBySlug } from '../../../services/fanzineService';
import type { FanzineType } from '../../../types/fanzine.types';

// Style
import styles from './MagazineDetailPage.module.css';

const MagazineDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();

    // 1. STATE: Ubah dari useMemo ke useState karena datanya dari API (Async)
    const [magazine, setMagazine] = useState<FanzineType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 2. EFFECT: Panggil API saat halaman dibuka / slug berubah
    useEffect(() => {
        if (!slug) return;

        setIsLoading(true);
        
        getFanzineBySlug(slug)
            .then((data) => {
                setMagazine(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Gagal mengambil detail fanzine:", err);
                setIsLoading(false);
            });
    }, [slug]);

    // 3. TAMPILAN LOADING
    if (isLoading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.heroSpacer} />
                <div className="text-center text-white py-20">Memuat Majalah...</div>
            </div>
        );
    }

    // 4. TAMPILAN JIKA TIDAK DITEMUKAN (404)
    if (!magazine) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.heroSpacer} />
                <div className="text-center text-white py-20">Majalah tidak ditemukan</div>
            </div>
        );
    }

    // 5. SETUP URL PDF
    // Pastikan file PDF Anda berada di folder 'public/magazine' di frontend
    // ATAU sesuaikan path ini jika file dilayani oleh Backend (misal: API_BASE_URL + '/uploads/' + ...)
    const fullPdfPath = `/magazine/${magazine.pdfFilename}`;

    // Helper sederhana untuk format tanggal (Opsional)
    const formattedDate = new Date(magazine.date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className={styles.pageWrapper}>
            {/* Hero Section / Spacer (80px) untuk Navigasi Mengambang */}
            <div className={styles.heroSpacer} />

            {/* Container Max-Width 1200px & Margin Auto */}
            <div className={styles.contentContainer}>
                
                {/* Header Info */}
                <div className={styles.header}>
                    <h1 className={styles.title}>{magazine.title}</h1>
                    <p className={styles.meta}>
                        {/* Perhatikan properti author_name dari API, bukan author */}
                        {formattedDate} | Oleh {magazine.author_name}
                    </p>
                </div>

                {/* Komponen FlipbookViewer */}
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

export default MagazineDetailPage;