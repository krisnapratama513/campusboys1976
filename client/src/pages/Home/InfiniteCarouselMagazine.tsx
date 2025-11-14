// client/src/Pages/Home/InfiniteCarouselMagazine.tsx

import InfiniteCarousel from "../../components/InfiniteCarousel/InfiniteCarousel";

const carouselImages = [
    { src: './magazine/cover/1_cover.png', alt: 'Gambar dari Halaman 1 PDF' },
    { src: './magazine/cover/2_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/3_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/4_cover.png', alt: 'Gambar dari Halaman 1 PDF' },
    { src: './magazine/cover/5_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/6_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/7_cover.png', alt: 'Gambar dari Halaman 1 PDF' },

    { src: './magazine/cover/1_cover.png', alt: 'Gambar dari Halaman 1 PDF' },
    { src: './magazine/cover/2_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/3_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/4_cover.png', alt: 'Gambar dari Halaman 1 PDF' },
    { src: './magazine/cover/5_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/6_cover.png', alt: 'Gambar Lain' },
    { src: './magazine/cover/7_cover.png', alt: 'Gambar dari Halaman 1 PDF' },
    
];

const InfiniteCarouselMagazine = () => {
    return (
        <InfiniteCarousel images={carouselImages} direction="left" />

    );
};

export default InfiniteCarouselMagazine;
