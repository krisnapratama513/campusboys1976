// client/src/pages/HomePage/index.tsx

import Hero from "./Hero/Hero";
import AboutSection from "./AboutSection/AboutSection";
// import InfiniteCarouselChapters from "./InfiniteCarouselChapters";
// import InfiniteCarouselMagazine from "./InfiniteCarouselMagazine";
import RecentArticlesCarousel from "./RecentArticlesCarousel";
import FanzineSection from "./FanzineSection/FanzineSection";
import ChapterSection from "./ChapterSection/ChapterSection";

const HomePage = () => {


    return (
        <>
            <Hero></Hero>
            <main>
                <AboutSection />
            </main>
            <RecentArticlesCarousel />
            <FanzineSection />
            <ChapterSection />

            {/* <main style={{ paddingTop: '30px', paddingBottom: '30px', backgroundColor: 'crimson' }}> */}
                {/* <InfiniteCarouselMagazine /> */}
                {/* <InfiniteCarouselChapters /> */}
            {/* </main> */}
        </>
    )
}

export default HomePage;