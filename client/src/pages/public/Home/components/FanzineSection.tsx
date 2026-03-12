/* client/scr/pages/public/Home/FanzineSection/FanzineSection.tsx */

import InfiniteCarouselMagazine from '../InfiniteCarouselMagazine';
import SectionWrapper from './SectionWrapper/SectionWrapper';

const FanzineSection = () => {
    return(
        <SectionWrapper title="Recent Fanzines" titleVariant="bottom-line">
            <InfiniteCarouselMagazine />
        </SectionWrapper>
    );
}

export default FanzineSection;