// client/src/components/FlipbookViewer/components/FlipbookBook/index.tsx
import { useCallback, useImperativeHandle, useRef, useMemo, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { FlipbookHandle, PDFDetails, ViewerState } from '../../types';
import PDFPage from '../PDFPage';
import styles from './FlipbookBook.module.css';

// PERBAIKAN: Hapus ref dari interface karena menggunakan forwardRef
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

// PERBAIKAN: Bungkus komponen dengan forwardRef
const FlipbookBook = forwardRef<FlipbookHandle, FlipbookBookProps>(({ pdfDetails, viewerState, onPageChange }, ref) => {
    const bookRef = useRef<PageFlipInstance>(null);
    const isMobile = useMediaQuery('(max-width:768px)');

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

    return (
        <div className={styles.bookWrapper} style={{ height: `${scaledHeight}px` }}>
            <div
                className={styles.transformWrapper}
                style={{ transform: `scale(${viewerState.zoomScale}) translateX(${translateX}px)` }}
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