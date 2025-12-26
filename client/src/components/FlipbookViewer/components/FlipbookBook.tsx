import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef
} from 'react';
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';
import type { FlipbookHandle, PDFDetails, ViewerState } from '../types';
import PDFPage from './PDFPage';
import styles from '../FlipbookViewer.module.css';

interface FlipbookBookProps {
    pdfDetails: PDFDetails;
    viewerState: ViewerState;
    onPageChange: (pageIndex: number) => void;
}

const FlipbookBook = forwardRef<FlipbookHandle, FlipbookBookProps>(({
    pdfDetails,
    viewerState,
    onPageChange
}, ref) => {
    const bookRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        next: () => bookRef.current?.pageFlip()?.flipNext(),
        prev: () => bookRef.current?.pageFlip()?.flipPrev(),
        goToPage: (index: number) => bookRef.current?.pageFlip()?.flip(index)
    }));

    // 1. Ambil ukuran asli halaman PDF
    const bookWidth = pdfDetails.width;
    const bookHeight = pdfDetails.height;


    // 2. Hitung tinggi visual wrapper agar tidak ada gap/ghost space saat di-zoom out
    const scaledHeight = bookHeight * viewerState.zoomScale;

    const onFlip = useCallback((e: any) => {
        onPageChange(e.data);
    }, [onPageChange]);

    /**
     * LOGIKA CENTERING
     * Menggeser buku secara horizontal agar Cover atau Halaman Terakhir
     * terlihat pas di tengah layar, baik di Desktop maupun Mobile.
     */
    /**
     * LOGIKA TRANSLATE (POSISI)
     */
    let translateX = 0;
    const isMobile = window.innerWidth < 768; // Cek ukuran layar
    if (isMobile) {
        // --- LOGIKA MOBILE (Pan & Scan) ---
        // Cover selalu di tengah
        if (viewerState.currentPage === 0) {
            translateX = -bookWidth / 2; // Geser agar cover ada di tengah
        }
        // Jika sedang melihat sisi KIRI (Halaman Genap, misal hal 2)
        // Kita harus geser buku ke KANAN (+)
        else if (viewerState.mobileView === 'left') {
            translateX = bookWidth / 2;
        }
        // Jika sedang melihat sisi KANAN (Halaman Ganjil, misal hal 3)
        // Kita harus geser buku ke KIRI (-)
        else if (viewerState.mobileView === 'right') {
            translateX = -(bookWidth / 2); // Geser lebih jauh ke kiri
            // Note: Mungkin perlu -bookWidth*1.5 tergantung titik tengah library, 
            // tapi coba -bookWidth/2 dulu (logic: geser spread ke kiri).
        }
    } else {
        // --- LOGIKA DESKTOP (Seperti sebelumnya) ---
        const isFirstPage = viewerState.currentPage === 0;
        const isLastPage = viewerState.currentPage === pdfDetails.numPages - 1;

        if (isFirstPage) {
            translateX = -bookWidth / 2;
        } else if (isLastPage && pdfDetails.numPages % 2 === 0) {
            translateX = bookWidth / 2;
        }
    }

    return (
        // WRAPPER 1: Mengontrol Tinggi DOM
        <div
            className={styles.bookWrapper}
            style={{
                height: `${scaledHeight}px`,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }}
        >
            {/* WRAPPER 2: Transformasi Scale & Translate */}
            <div
                style={{
                    // Menggabungkan Scale (Zoom) dan Translate (Centering)
                    transform: `scale(${viewerState.zoomScale}) translateX(${translateX}px)`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
            >
                {/* @ts-ignore */}
                <HTMLFlipBook
                    ref={bookRef}
                    width={bookWidth}
                    height={bookHeight}
                    size="fixed"
                    drawShadow={true}
                    flippingTime={800}
                    usePortrait={false}
                    startPage={viewerState.currentPage}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={onFlip}
                    disableFlipByClick={window.innerWidth < 768}
                    className={styles.flipBookContainer}
                    style={{ margin: '0 auto' }}
                >
                    {Array.from({ length: pdfDetails.numPages }, (_, index) => (
                        <PDFPage
                            key={`page-${index}`}
                            pageNumber={index + 1}
                            width={bookWidth}
                            height={bookHeight}
                            zoomScale={viewerState.zoomScale}
                        />
                    ))}
                </HTMLFlipBook>
            </div>
        </div>
    );
});

FlipbookBook.displayName = 'FlipbookBook';

export default FlipbookBook;