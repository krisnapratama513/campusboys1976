// client/src/pages/HomePage/index.tsx

import Hero from "./Hero/Hero";
import AboutSection from "./AboutSection/AboutSection";
import InfiniteCarouselChapters from "./InfiniteCarouselChapters";
import InfiniteCarouselMagazine from "./InfiniteCarouselMagazine";
import RecentArticlesCarousel from "./RecentArticlesCarousel";

const HomePage = () => {


    return (
        <>
            <Hero></Hero>
            <main>
                <AboutSection />
            </main>
            <RecentArticlesCarousel />
            <main>
                <InfiniteCarouselChapters />
                <InfiniteCarouselMagazine />
            </main>
            <div style={{ height: "300px", width: "100px", backgroundColor: "crimson" }}>
            </div>
        </>
    )
}

export default HomePage;