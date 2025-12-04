// client/src/pages/Magazine/index.tsx

import styles from './MagazinePage.module.css';
import HeroSection from '../Video/HeroSection'; // hanya untuk sementara
import MagazineCard from '../../components/MagazineCard';
import { dummyMagazineData } from './dummy';


const MagazinePage = () => {
    return (
        <div className={styles.magazinePage}>
            <HeroSection />
            <div className={styles.magazineContainer}>
                {/* saat ini ada 3 data dummy */}
                {dummyMagazineData.map((magazine, index) => (
                    <MagazineCard 
                        key={index} // Selalu wajib ada
                        href={`/magazine/${magazine.slug}`}
                        imgFilename={magazine.imgFilename}
                        author={magazine.author}
                        date={magazine.date}
                        isoDate={magazine.isoDate}
                        title={magazine.title}
                    />
                ))}
            </div>
        </div>

    )
};

export default MagazinePage;