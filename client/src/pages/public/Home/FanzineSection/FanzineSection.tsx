import styles from './FanzineSection.module.css';
import InfiniteCarouselMagazine from '../InfiniteCarouselMagazine';
const FanzineSection = () => {
    return(
        <main>
            <section className={styles.container}>
                <h2 className={styles.sectionTitle}>
                    Recent Fanzine
                </h2>
                <InfiniteCarouselMagazine />
            </section>
        </main>
    );
}

export default FanzineSection;