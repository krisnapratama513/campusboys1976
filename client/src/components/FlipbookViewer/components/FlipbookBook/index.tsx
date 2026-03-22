// client/src/components/FlipbookViewer/components/FlipbookBook/index.tsx

import { useCallback, useImperativeHandle, useRef, useMemo, forwardRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { FlipbookHandle, PDFDetails, ViewerState } from '../../types';
import PDFPage from '../PDFPage';
import styles from './FlipbookBook.module.css';

interface FlipbookBookProps {
    pdfDetails: PDFDetails;
    viewerState: ViewerState;
    onPageChange: (pageIndex: number) => void;
}

interface PageFlipInstance {
    pageFlip: () => {
        flipNext: () => void;
        flipPrev: () => void;
        flip: (index: number) => void;
    };
}

const calculateTranslateX = (
    isMobile: boolean,
    currentPage: number,
    mobileView: 'center' | 'left' | 'right',
    bookWidth: number,
    numPages: number
): number => {
    if (isMobile) {
        if (currentPage === 0) return -bookWidth / 2;
        if (mobileView === 'left') return bookWidth / 2;
        if (mobileView === 'right') return -(bookWidth / 2);
        return 0;
    }

    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === numPages - 1;

    if (isFirstPage) return -bookWidth / 2;
    if (isLastPage && numPages % 2 === 0) return bookWidth / 2;
    
    return 0;
};

const FlipbookBook = forwardRef<FlipbookHandle, FlipbookBookProps>(({ pdfDetails, viewerState, onPageChange }, ref) => {
    const bookRef = useRef<PageFlipInstance>(null);
    const isMobile = useMediaQuery('(max-width:768px)');

    // --- STATE & REF UNTUK DRAG-TO-PAN ---
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Reset posisi pan ke tengah jika zoom di-reset
    useEffect(() => {
        if (!viewerState.isManualZoom) {
            setPan({ x: 0, y: 0 });
        }
    }, [viewerState.isManualZoom, viewerState.zoomScale]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!viewerState.isManualZoom) return; // Hanya bisa pan saat di-zoom
        setIsDragging(true);
        dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
        (e.target as HTMLElement).setPointerCapture(e.pointerId); // Tangkap pergerakan pointer di luar elemen
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;

        const totalWidth = bookWidth * (isMobile ? 1 : 2);
        
        // Batas Kiri - Kanan (karena center)
        const boundX = Math.max(0, (totalWidth * viewerState.zoomScale - totalWidth) / 2) + 100;
        
        const newX = e.clientX - dragStart.current.x;

        // Terapkan Clamp hanya untuk X, matikan Y
        setPan({
            x: Math.min(Math.max(newX, -boundX), boundX), // Kunci X
            y: 0  // Kunci mati sumbu Y agar tidak bisa digeser atas/bawah
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };
    // -------------------------------------

    useImperativeHandle(ref, () => ({
        next: () => bookRef.current?.pageFlip()?.flipNext(),
        prev: () => bookRef.current?.pageFlip()?.flipPrev(),
        goToPage: (index: number) => bookRef.current?.pageFlip()?.flip(index)
    }),[]);

    const bookWidth = pdfDetails.width;
    const bookHeight = pdfDetails.height;
    const scaledHeight = bookHeight * viewerState.zoomScale;

    const onFlip = useCallback((e: { data: number }) => {
        onPageChange(e.data);
    }, [onPageChange]);

    const translateX = calculateTranslateX(
        isMobile, 
        viewerState.currentPage, 
        viewerState.mobileView, 
        bookWidth, 
        pdfDetails.numPages
    );

    const pages = useMemo(() => {
        return Array.from({ length: pdfDetails.numPages }, (_, index) => (
            <PDFPage
                key={`page-${index}`}
                pageNumber={index + 1}
                width={bookWidth}
                height={bookHeight}
            />
        ));
    }, [pdfDetails.numPages, bookWidth, bookHeight]);

    // Kursor dinamis berdasarkan status zoom dan drag
    const cursorStyle = viewerState.isManualZoom ? (isDragging ? 'grabbing' : 'grab') : 'default';

    return (
        <div 
            className={styles.bookWrapper} 
            style={{ height: `${scaledHeight}px` }}
        >
            <div
                className={styles.transformWrapper}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ 
                    // Terapkan Translate (Pan) lalu Scale lalu TranslateX (Posisi Halaman)
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${viewerState.zoomScale}) translateX(${translateX}px)`,
                    cursor: cursorStyle,
                    // Matikan efek transisi (animasi) saat sedang didrag agar tidak terasa lag
                    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    touchAction: viewerState.isManualZoom ? 'pan-y' : 'auto' // Cegah scroll layar bawaan HP saat sedang drag buku
                }}
            >
                {/* @ts-expect-error - library types missing some standard props */}
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
                    className={styles.flipBookContainer}
                    disableFlipByClick={true}
                    useMouseEvents={false}
                >
                    {pages}
                </HTMLFlipBook>
            </div>
        </div>
    );
});

FlipbookBook.displayName = 'FlipbookBook';
export default FlipbookBook;