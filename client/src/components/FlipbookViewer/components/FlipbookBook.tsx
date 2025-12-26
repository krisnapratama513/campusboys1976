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

    /**
     * PERBAIKAN LOGIC UKURAN:
     * Kita gunakan ukuran ASLI (fix) untuk properti width/height HTMLFlipBook.
     * Scaling akan dilakukan via CSS Transform di div pembungkus.
     * Ini mencegah gap/overlap karena geometri buku tidak berubah-ubah.
     */
    // Jika PDF terlalu besar (misal > 1000px), kita bisa set base size yang wajar
    // Tapi menggunakan ukuran asli biasanya paling aman untuk rasio.
    const bookWidth = pdfDetails.width;
    const bookHeight = pdfDetails.height;

    const onFlip = useCallback((e: any) => {
        onPageChange(e.data);
    }, [onPageChange]);

    return (
        // Terapkan CSS Scale di sini
        <div
            className={styles.bookWrapper}
            style={{
                transform: `scale(${viewerState.zoomScale})`,
                // Pastikan transform origin di tengah agar zoom in/out tetap sentris
                transformOrigin: 'top center',
                transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
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
                style={{ margin: '0 auto' }} // Paksa centering
            >
                {Array.from({ length: pdfDetails.numPages }, (_, index) => (
                    <PDFPage
                        key={`page-${index}`}
                        pageNumber={index + 1}
                        width={bookWidth}
                        height={bookHeight}
                        // Tetap kirim zoomScale ke PDFPage agar resolusi gambar tajam (tidak blur saat di-zoom CSS)
                        zoomScale={viewerState.zoomScale}
                    />
                ))}
            </HTMLFlipBook>
        </div>
    );
});

FlipbookBook.displayName = 'FlipbookBook';

export default FlipbookBook;