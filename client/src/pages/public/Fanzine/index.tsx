// client/src/pages/Magazine/index.tsx

import styles from './MagazinePage.module.css';
import MediaHeroSection from '../../../components/MediaHeroSection';
import FanzineCard from '../../../components/FanzineCard';
import { getAllFanzine } from '../../../services/fanzineService';
import { useEffect, useState } from 'react';
import type { FanzineType } from '../../../types/fanzine.types';


const FanzinePage = () => {
    const [fanzines, setfanzines] = useState<FanzineType[]>([]);

    useEffect(() => {
        getAllFanzine()
            .then(data => {
                setfanzines(data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    return (
        <div className={styles.fanzineContainerPage}>
            <MediaHeroSection title='Fanzine' />
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
        </div>

    );
};

export default FanzinePage;