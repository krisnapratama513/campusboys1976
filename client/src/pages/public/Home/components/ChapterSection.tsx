/* client/src/pages/public/Home/components/ChapterSection.tsx */

import InfiniteCarousel from '@/components/InfiniteCarousel/InfiniteCarousel';
import StatusView from '@/components/StatusView';
import { useChapterImages } from '@/hooks/useChapterImages';
import SectionWrapper from './SectionWrapper';

const ChapterSection = () => {
    const { images, loading, error } = useChapterImages();

    if (!loading && !error && images.length === 0) return null;

    return(
        <SectionWrapper title="Chapters" isDarkBg={true} titleVariant="center-lines">
            {loading ? (
                <StatusView message="Memuat logo chapter..." />
            ) : error ? (
                <StatusView message={error} isError />
            ) : 
                <InfiniteCarousel images={images} theme='navy' />
            }
        </SectionWrapper>
    );
};

export default ChapterSection;