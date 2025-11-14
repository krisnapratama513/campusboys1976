// Import dependensi React dan Tipe
import { useState, useEffect, type CSSProperties } from 'react';
import { Link } from 'react-router-dom'; // Gunakan Link untuk routing

// Import komponen kustom (Card dan Tombol)
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import ButtonCarousel from '../../components/ButtonCarousel/ButtonCarousel';




// import { mockArticles } from '../../data/mockArticles';
// import { type Article } from '../types/article';
// ========================================================================
// TIPE DATA BARU (Sesuai JSON dari API)
// ========================================================================
type ApiArticleCard = {
    id: number;
    slug: string;
    img: string;
    title: string;
    created_at: string; // Ini akan jadi string (ISO Date)
    description: string;
    author_name: string;
};

// ========================================================================
// DEFINISI STYLE (CSS-in-JS)
// Mendefinisikan style sebagai konstanta agar JSX lebih bersih
// dan style mudah digunakan kembali.
// ========================================================================

const header: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    margin: '10px 0',
    color: 'rgb(236, 232, 225)',
};

const h2: CSSProperties = {
    fontFamily: "'Capture It', sans-serif", // Menggunakan font kustom
    fontSize: '1.75rem',
    letterSpacing: '1.2px',
    marginBottom: '-5px',
    textShadow: '1px 1px 0px rgba(0, 0, 0, 0.4)'
};

const slidesWrapper: CSSProperties = {
    position: 'relative',
    overflow: 'hidden', // Penting untuk carousel agar kartu yang 'di luar' tidak terlihat
    width: '100%'
};

const carouselNavigation: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '30px'
};




/**
 * Komponen RecentArticlesCarousel
 * Menampilkan beberapa artikel terbaru dalam format carousel yang responsif.
 */
function RecentArticlesCarousel() {
    const [articles, setArticles] = useState<ApiArticleCard[]>([]);
    const [loading, setLoading] = useState(true);

    // State untuk melacak jumlah kartu yang akan ditampilkan (berubah sesuai lebar layar)
    const [cardsToShow, setCardsToShow] = useState(3);
    // State untuk melacak indeks artikel pertama yang sedang ditampilkan di carousel
    const [currentIndex, setCurrentIndex] = useState(0);

    // ========================================================================
    // EFEK (EFFECTS)
    // ========================================================================

    // Efek untuk mengambil (fetch) data artikel dari API
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/articles/recent');
                if (!response.ok) {
                    throw new Error('Gagal mengambil data artikel');
                }
                const data: ApiArticleCard[] = await response.json();
                setArticles(data); // Simpan data ke state
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Selesai loading
            }
        };

        fetchArticles();
    }, []); // [] = Jalankan sekali saat komponen di-mount

    // useEffect untuk menangani responsivitas carousel
    useEffect(() => {
        // Fungsi ini akan memeriksa lebar window dan mengatur state 'cardsToShow'
        const handleResize = () => {
            const width = window.innerWidth;
            if (width <= 600) {
                setCardsToShow(1); // 1 kartu di layar kecil (mobile)
            } else if (width <= 900) {
                setCardsToShow(2); // 2 kartu di layar sedang (tablet)
            } else {
                setCardsToShow(3); // 3 kartu di layar besar (desktop)
            }
        };

        // Panggil fungsi handleResize sekali saat komponen pertama kali di-mount
        handleResize();
        
        // Tambahkan event listener untuk memanggil handleResize setiap kali ukuran window berubah
        window.addEventListener('resize', handleResize);

        // Fungsi cleanup: Hapus event listener saat komponen di-unmount
        // Ini penting untuk mencegah memory leak
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Array dependensi kosong '[]' berarti efek ini hanya berjalan saat mount dan unmount

    
    // Style dinamis untuk container slide
    // Jumlah kolom grid (gridTemplateColumns) diatur berdasarkan state 'cardsToShow'
    const slidesContainer: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${cardsToShow}, 1fr)`, // Misal: 'repeat(3, 1fr)'
        gap: '20px'
    };


    // Fungsi untuk menggeser ke artikel sebelumnya (kiri)
    const handlePrevious = () => {
        setCurrentIndex((prev) => {
            // Jika indeks saat ini adalah 0, putar kembali ke akhir array (panjang array - 1)
            // Jika tidak, cukup kurangi 1
            return prev - 1 < 0 ? articles.length - 1 : prev - 1;
        });
    };

    // Fungsi untuk menggeser ke artikel berikutnya (kanan)
    const handleNext = () => {
        setCurrentIndex((prev) => {
            // Gunakan operasi modulo (%) untuk 'looping'
            // (prev + 1) % articlesData.length
            // Contoh: Jika prev = 4 dan panjang = 5, (4 + 1) % 5 = 0 (kembali ke awal)
            return (prev + 1) % articles.length;
        });
    };

    // Logika untuk menentukan artikel mana yang terlihat
    // Ini mengambil data dari 'articlesData' berdasarkan 'currentIndex' dan 'cardsToShow'
    const visibleArticles = [];
    for (let i = 0; i < cardsToShow; i++) {
        // Gunakan modulo (%) lagi untuk memastikan 'wrapping' jika mencapai akhir data
        // Contoh: Jika currentIndex = 4, cardsToShow = 3, dan total data = 5
        // i=0 -> (4 + 0) % 5 = 4 (artikel ke-4)
        // i=1 -> (4 + 1) % 5 = 0 (artikel ke-0)
        // i=2 -> (4 + 2) % 5 = 1 (artikel ke-1)
        const index = (currentIndex + i) % articles.length;
        visibleArticles.push(articles[index]);
    }

    // ========================================================================
    // RENDER
    // ========================================================================

    // Tampilkan pesan loading jika data belum siap
    if (loading) {
        return (
            <article style={{ backgroundColor: 'rgb(15, 25, 35)', height: '400px' }}>
                <main className="container" style={{paddingTop: '50px', paddingBottom: '50px'}}>
                    <div style={header}>
                        <h2 style={h2}>ARTIKEL TERBARU</h2>
                    </div>
                    <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>
                        Memuat artikel...
                    </div>
                </main>
            </article>
        );
    }


    // Render JSX
    return (
        // Wrapper utama komponen dengan warna latar belakang
        // 312F2C
        // rgb(15, 25, 35)
        <article style={{ backgroundColor: 'rgb(15, 25, 35)', fontFamily: 'Roboto, sans-serif' }}>
            {/* 'container' mungkin kelas global untuk membatasi lebar dan memberi padding */}
            <main className="container" style={{paddingTop: '50px', paddingBottom: '50px'}}>
                
                {/* Bagian Header: Judul dan Link "Lihat Semua" */}
                <div style={header}>
                    <h2 style={h2}>ARTIKEL TERBARU</h2>
                    <Link style={{ textDecoration: 'none', color: 'rgb(236, 232, 225)' }} to="/artikel">
                        BUKA HALAMAN ARTIKEL
                    </Link>
                </div>

                {/* Wrapper untuk area slides (yang akan di-overflow) */}
                <div style={slidesWrapper}>
                    {/* Container yang berisi kartu-kartu (menggunakan grid dinamis) */}
                    <div style={slidesContainer}>
                        {/* Transformasi data dari API ke PROPS ArticleCard
                            dilakukan langsung di dalam map
                        */}
                        {visibleArticles.map((article) => (
                            <ArticleCard
                                key={article.id} // 'key' adalah prop wajib di React untuk list, harus unik
                                href={`/article/${article.slug}`}
                                imgFilename={article.img}
                                author={article.author_name}
                                date={article.created_at}
                                title={article.title}
                                description={article.description}
                            />
                        ))}
                    </div>
                </div>

                {/* Bagian Navigasi Carousel (Tombol Kiri/Kanan) */}
                <div style={carouselNavigation}>
                    <ButtonCarousel
                        direction="left"
                        onClick={handlePrevious} // Menghubungkan tombol ke fungsi 'handlePrevious'
                    />
                    <ButtonCarousel
                        direction="right"
                        onClick={handleNext} // Menghubungkan tombol ke fungsi 'handleNext'
                    />
                </div>

            </main>
        </article>
    )
}

export default RecentArticlesCarousel;