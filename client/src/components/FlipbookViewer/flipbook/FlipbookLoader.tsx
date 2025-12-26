// client/src/components/FlipbookViewer/flipbook/FlipbookLoader.tsx

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

export interface FlipbookHandle {
    next: () => void;
    prev: () => void;
    turnToPage: (index: number) => void;
}

const FlipbookLoader = forwardRef<FlipbookHandle, FlipbookLoaderProps>(({ 
    pdfDetails, scale, viewerStates, setViewerStates, viewRange, setViewRange 
}, ref) => {
    
    const { width } = useWindowSize();
    const debouncedZoom = useDebounce(viewerStates.zoomScale, 500);
    const bookRef = useRef<any>(null);

    const startPageRef = useRef(viewerStates.currentPageIndex);
    const prevScaleRef = useRef(scale);

    if (prevScaleRef.current !== scale) {
        startPageRef.current = viewerStates.currentPageIndex;
        prevScaleRef.current = scale;
    }

    useImperativeHandle(ref, () => ({
        next: () => { bookRef.current?.pageFlip()?.flipNext(); },
        prev: () => { bookRef.current?.pageFlip()?.flipPrev(); },
        turnToPage: (index: number) => {
            if (bookRef.current && bookRef.current.pageFlip()) {
                bookRef.current.pageFlip().flip(index); 
            }
        }
    }));

    const boxWidth = pdfDetails.width * scale;
    const boxHeight = pdfDetails.height * scale;

    const isPageInViewRange = (index: number) => index >= viewRange[0] && index <= viewRange[1];
    
    // HAPUS: const isPageInView = ... (Tidak perlu lagi)

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
                ref={bookRef}
                key={scale}
                startPage={startPageRef.current} 
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
                        // HAPUS PROP: isPageInView={...}
                        // Kita hentikan pengiriman prop ini agar Memo bekerja maksimal
                    />
                ))}
            </HTMLFlipBook>
        </div>
    );
});

FlipbookLoader.displayName = 'FlipbookLoader';
export default FlipbookLoader;