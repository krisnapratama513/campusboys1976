// client/src/Pages/Home/InfiniteCarouselMagazine.tsx

import InfiniteCarousel from "../../../components/InfiniteCarousel/InfiniteCarousel";
import { getAllFanzine } from "../../../services/fanzineService";
import type { FanzineType } from "../../../types/fanzine.types";
import { useState, useEffect, useMemo } from "react";


const InfiniteCarouselMagazine = () => {
    const [fanzines, setFanzines] = useState<FanzineType[]>([]);
    useEffect(() => {
        getAllFanzine()
            .then(data => {
                setFanzines(data);
            })
            .catch(err => {
                console.error(err);
            });

    }, []);

    const carouselImages = useMemo(() => {
        return fanzines.map(fanzine => ({
            src: `./magazine/cover/${fanzine.imgFilename}`,
            alt: `cover${fanzine.imgFilename}`
        }));
    }, [fanzines]);
    return (
        <InfiniteCarousel images={carouselImages} direction="left" />
    );
};

export default InfiniteCarouselMagazine;
