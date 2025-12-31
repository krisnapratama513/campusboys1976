// client/src/pages/MagazineDetailPage/index.tsx

import  { useMemo } from 'react';
import { useParams } from 'react-router-dom';
// import MyFlipbook from '../../components/pdf-viewer/MyFlipbook'; 

// import FlipbookViewer from '../../components/FlipbookViewer';
import FlipbookViewer from '../../../components/FlipbookViewer';
import { dummyMagazineData } from '../Fanzine/dummy';

// Import CSS Module
import styles from './MagazineDetailPage.module.css';

const MagazineDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();

    const magazine = useMemo(() => {
        return dummyMagazineData.find(item => item.slug === slug);
    }, [slug]);

    if (!magazine) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.heroSpacer} />
                <div className="text-center text-white py-20">Majalah tidak ditemukan</div>
            </div>
        );
    }

    const fullPdfPath = `/magazine/${magazine.pdfFilename}`;

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
                        {magazine.date} | Oleh {magazine.author}
                    </p>
                </div>

                {/* Gunakan komponen FlipbookViewer yang baru */}
                <div className={styles.flipbookWrapper}>
                    <FlipbookViewer 
                        pdfUrl={fullPdfPath}
                        className="shadow-2xl" // Opsional: tambah shadow luar
                    />
                </div>
            </div>
        </div>
    );
};

export default MagazineDetailPage;