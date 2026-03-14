// client/src/pages/HomePage/index.tsx

import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import RecentArticlesCarousel from "./components/RecentArticlesCarousel";
import FanzineSection from "./components/FanzineSection";
import ChapterSection from "./components/ChapterSection";

const HomePage = () => {


    return (
        <>
            <HeroSection />
            <AboutSection />
            <RecentArticlesCarousel />
            <FanzineSection />
            <ChapterSection />
        </>
    )
}

export default HomePage;