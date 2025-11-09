// client/src/pages/HomePage/index.tsx

import Hero from "./Hero/Hero";
import InfiniteCarouselChapters from "./InfiniteCarouselChapters";

const HomePage = () => {


    return (
        <>
            <Hero></Hero>
            <InfiniteCarouselChapters />
            
            <div style={{ height: "300px", width: "100px", backgroundColor: "crimson" }}>
            </div>
        </>
    )
}

export default HomePage;