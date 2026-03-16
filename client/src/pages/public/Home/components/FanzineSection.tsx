/* client/scr/pages/public/Home/components/FanzineSection.tsx */

import SectionWrapper from './SectionWrapper';
import InfiniteCarousel from '@/components/InfiniteCarousel/InfiniteCarousel';
import StatusView from '@/components/StatusView';

import { useRecentFanzines } from '@/hooks/useRecentFanzines';


const FanzineSection = () => {

    const {images, loading, error} = useRecentFanzines();

    if (!loading && !error && images.length === 0) return null;

    return(
        <SectionWrapper title="Recent Fanzines" titleVariant="bottom-line">
            {loading ? (
                <StatusView message="Memuat Recent Fanzine..." />
            ) : error ? (
                <StatusView message={error} isError />
            ) : (
                <InfiniteCarousel 
                    images={images} 
                    direction="left" 
                    size="large"
                    theme="black"
                />
            )}
        </SectionWrapper>
    );
}

export default FanzineSection;