// client/src/Pages/Home/InfiniteCarouselMagazine.tsx

import InfiniteCarousel from "../../components/InfiniteCarousel/InfiniteCarousel";

const carouselImages = [
    { src: './magazine/cover/1_cover.png', alt: 'Gambar dari Halaman 1 PDF' },
    { src: './magazine/cover/2_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/3_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/1_cover.png', alt: 'Gambar dari Halaman 1 PDF' },
    { src: './magazine/cover/2_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/3_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/1_cover.png', alt: 'Gambar dari Halaman 1 PDF' },
    { src: './magazine/cover/2_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/3_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/1_cover.png', alt: 'Gambar dari Halaman 1 PDF' },
    { src: './magazine/cover/2_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/3_cover.png', alt: 'Gambar Lain' },
];

const InfiniteCarouselMagazine = () => {
    return (
        <InfiniteCarousel images={carouselImages} direction="left" />

    );
};

export default InfiniteCarouselMagazine;
