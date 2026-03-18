// client/src/pages/public/Fanzine/index.tsx

import { useState } from 'react';
import styles from './Fanzine.module.css';

import MediaHeroSection from '@/components/MediaHeroSection';
import FanzineCard from '@/components/FanzineCard';
import Pagination from '@/components/Pagination';
import StatusView from '@/components/StatusView';
import { useFanzines } from '@/hooks/useFanzines';

/**
 * Halaman Public: Fanzine Gallery.
 * Menampilkan daftar semua fanzine yang telah terbit.
 * * @component
 */

const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};
const FanzinePage = () => {
    const [page, setPage] = useState(1);
    const { fanzines, totalPages, loading, error } = useFanzines(page);


    return (
        <div className={styles.fanzineContainerPage}>
            <MediaHeroSection title='Fanzine Collection' />
            
            {loading && <StatusView message="Memuat koleksi fanzine..." />}
            {error && <StatusView message={error} isError />}
            {!loading && !error && fanzines.length === 0 && (
                <StatusView message="Belum ada fanzine yang diterbitkan." />
            )}

            {!loading && !error && fanzines.length > 0 && (
                <>
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
                    <div style={{ paddingBottom: '40px' }}>
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={setPage} // Langsung passing function reference
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default FanzinePage;