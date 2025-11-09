// client/src/pages/HomePage/index.tsx

import Hero from "./Hero/Hero";
import InfiniteCarouselChapters from "./InfiniteCarouselChapters";

const HomePage = () => {


    return (
        <>
            <Hero></Hero>
            <InfiniteCarouselChapters />
            
            <div style={{ height: "300px" }}>
            </div>
        </>
    )
}

export default HomePage;