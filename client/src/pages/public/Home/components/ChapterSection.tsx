/* client/scr/pages/public/Home/components/ChapterSection.tsx */

import InfiniteCarouselChapters from './InfiniteCarouselChapters';
import SectionWrapper from './SectionWrapper';

const ChapterSection = () => {
    return(
        <SectionWrapper title="Chapters" isDarkBg={true} titleVariant="center-lines">
            <InfiniteCarouselChapters />
        </SectionWrapper>
    );
};

export default ChapterSection;