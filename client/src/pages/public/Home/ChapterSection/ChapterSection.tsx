import styles from './ChapterSection.module.css'
import InfiniteCarouselChapters from '../InfiniteCarouselChapters';

const ChapterSection = () => {
    return(
        // <main>
            <section className={styles.container}>
                <h2 className={styles.sectionTitle}>
                    Chapters
                </h2>
                <main>
                <InfiniteCarouselChapters />
                </main>
            </section>
        // </main>
    );
};

export default ChapterSection;