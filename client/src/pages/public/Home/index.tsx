// client/src/pages/HomePage/index.tsx

import './index.css';

import Hero from "./components/Hero/Hero";
import AboutSection from "./AboutSection/AboutSection";
import RecentArticlesCarousel from "./RecentArticlesCarousel";
import FanzineSection from "./components/FanzineSection";
import ChapterSection from "./components/ChapterSection";

const HomePage = () => {


    return (
        <>
            <Hero></Hero>
            <div className="content-wrapper">
                <AboutSection />
            </div>
            <RecentArticlesCarousel />
            <FanzineSection />
            <ChapterSection />
        </>
    )
}

export default HomePage;