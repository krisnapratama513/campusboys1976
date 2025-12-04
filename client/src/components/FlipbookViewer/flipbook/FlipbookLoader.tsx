import React, { forwardRef, memo, useCallback, useEffect, useState, useRef, useImperativeHandle } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useWindowSize } from 'react-use';
import PdfPage from './PDFPage';
import styles from '../FlipbookViewer.module.css';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
}

const MemoizedPdfPage = memo(PdfPage);

interface FlipbookLoaderProps {
    pdfDetails: { width: number; height: number; totalPages: number; };
    scale: number;
    viewerStates: { currentPageIndex: number; zoomScale: number; };
    setViewerStates: (states: any) => void;
    viewRange: number[];
    setViewRange: (range: number[]) => void;
}

// Definisikan tipe fungsi yang bisa dipanggil parent
export interface FlipbookHandle {
    next: () => void;
    prev: () => void;
}

const FlipbookLoader = forwardRef<FlipbookHandle, FlipbookLoaderProps>(({ 
    pdfDetails, scale, viewerStates, setViewerStates, viewRange, setViewRange 
}, ref) => {
    
    const { width } = useWindowSize();
    const debouncedZoom = useDebounce(viewerStates.zoomScale, 500);

    // 1. Ref Internal (Langsung ke Library)
    const bookRef = useRef<any>(null);

    // 2. EXPOSE Method ke Parent (Remote Control)
    useImperativeHandle(ref, () => ({
        next: () => {
            if (bookRef.current && bookRef.current.pageFlip()) {
                bookRef.current.pageFlip().flipNext();
            }
        },
        prev: () => {
            if (bookRef.current && bookRef.current.pageFlip()) {
                bookRef.current.pageFlip().flipPrev();
            }
        }
    }));

    const boxWidth = pdfDetails.width * scale;
    const boxHeight = pdfDetails.height * scale;

    const isPageInViewRange = (index: number) => index >= viewRange[0] && index <= viewRange[1];
    const isPageInView = (index: number) => viewerStates.currentPageIndex === index || viewerStates.currentPageIndex + 1 === index;

    const onFlip = useCallback((e: any) => {
        let newViewRange;
        if (e.data > viewerStates.currentPageIndex) {
            newViewRange = [viewRange[0], Math.max(Math.min(e.data + 4, pdfDetails.totalPages), viewRange[1])];
        } else if (e.data < viewerStates.currentPageIndex) {
            newViewRange = [Math.min(Math.max(e.data - 4, 0), viewRange[0]), viewRange[1]];
        } else {
            newViewRange = viewRange;
        }
        setViewRange(newViewRange);
        setViewerStates({ ...viewerStates, currentPageIndex: e.data });
    }, [viewerStates, viewRange, setViewRange, setViewerStates, pdfDetails.totalPages]);

    return (
        <div className={styles.relativeWrapper}>
            {/* @ts-ignore */}
            <HTMLFlipBook
                ref={bookRef} // Sambungkan ke Ref Internal
                key={scale}
                startPage={viewerStates.currentPageIndex}
                width={boxWidth} 
                height={boxHeight}
                size="fixed"
                drawShadow={true}
                flippingTime={700}
                usePortrait={false}
                showCover={true}
                showPageCorners={false}
                onFlip={onFlip}
                disableFlipByClick={width < 768}
                className={viewerStates.zoomScale > 1 ? styles.disablePointer : ''}
                style={{ margin: '0 auto' }}
            >
                {Array.from({ length: pdfDetails.totalPages }, (_, index) => (
                    <MemoizedPdfPage
                        key={index}
                        width={boxWidth} 
                        height={boxHeight}
                        zoomScale={debouncedZoom}
                        page={index + 1}
                        isPageInViewRange={isPageInViewRange(index)}
                        isPageInView={isPageInView(index)}
                    />
                ))}
            </HTMLFlipBook>
        </div>
    );
});

FlipbookLoader.displayName = 'FlipbookLoader';
export default FlipbookLoader;