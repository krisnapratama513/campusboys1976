/* client/scr/pages/public/Home/components/FanzineSection.tsx */

import InfiniteCarouselMagazine from './InfiniteCarouselMagazine';
import SectionWrapper from './SectionWrapper';

const FanzineSection = () => {
    return(
        <SectionWrapper title="Recent Fanzines" titleVariant="bottom-line">
            <InfiniteCarouselMagazine />
        </SectionWrapper>
    );
}

export default FanzineSection;