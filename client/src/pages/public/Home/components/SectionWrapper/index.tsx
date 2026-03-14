// client/src/pages/public/Home/components/SectionWrapper/index.tsx

import styles from './SectionWrapper.module.css';
import ContentWrapper from '../ContentWrapper';

interface SectionWrapperProps {
    title: string;
    children: React.ReactNode;
    isDarkBg?: boolean; // Untuk background hitam di ChapterSection
    titleVariant?: 'center-lines' | 'bottom-line'; // Untuk beda gaya garis judul
}

const SectionWrapper = ({ 
    title, 
    children, 
    isDarkBg = false, 
    titleVariant = 'bottom-line' 
}: SectionWrapperProps) => {
    return (
        <section className={`${styles.container} ${isDarkBg ? styles.darkBg : ''}`}>
            <h2 className={`${styles.sectionTitle} ${styles[titleVariant]}`}>
                {title}
            </h2>
            <ContentWrapper>
                {children}
            </ContentWrapper>
        </section>
    );
};

export default SectionWrapper;
