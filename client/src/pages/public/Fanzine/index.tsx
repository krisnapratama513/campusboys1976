// client/src/pages/public/Fanzine/index.tsx

import { useEffect, useState } from 'react';
import styles from './Fanzine.module.css';

// Components & Services
import MediaHeroSection from '../../../components/MediaHeroSection';
import FanzineCard from '../../../components/FanzineCard';
import { getAllFanzine } from '../../../services/fanzineService';
import type { FanzineType } from '../../../types/fanzine.types';

/**
 * Halaman Public: Fanzine Gallery.
 * Menampilkan daftar semua fanzine yang telah terbit.
 * * @component
 */
const FanzinePage = () => {
    const [fanzines, setFanzines] = useState<FanzineType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAllFanzine()
            .then(data => {
                setFanzines(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("[FanzinePage] Error:", err);
                setIsLoading(false);
            });
    }, []);

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { // Pakai format Indo biar sesuai
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.fanzineContainerPage}>
            <MediaHeroSection title='Fanzine Collection' />
            
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <p>Memuat koleksi fanzine...</p>
                </div>
            ) : fanzines.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <p>Belum ada fanzine yang diterbitkan.</p>
                </div>
            ) : (
                <div className={styles.fanzineContainer}>
                    {fanzines.map((fanzine) => (
                        <FanzineCard
                            key={fanzine.id}
                            href={`/fanzine/${fanzine.slug}`}
                            imgFilename={fanzine.imgFilename}
                            author={fanzine.author_name}
                            date={formatDate(fanzine.date)}
                            title={fanzine.title}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FanzinePage;