import React, { forwardRef, memo } from 'react';
import { Page } from 'react-pdf';
import styles from '../FlipbookViewer.module.css';

interface PdfPageProps {
    page: number;
    width: number; // Tambahkan Width
    height: number;
    zoomScale: number;
    isPageInView: boolean;
    isPageInViewRange: boolean;
}

const PdfPage = forwardRef<HTMLDivElement, PdfPageProps>(({ 
    page, 
    width, // Terima width
    height,
    zoomScale, 
    isPageInView, 
    isPageInViewRange 
}, ref) => {
    
    const alignStyle = page % 2 === 0 ? 'flex-end' : 'flex-start';

    return (
        <div 
            ref={ref} 
            className={`${styles.pageBase} ${styles.pageBackground}`}
            style={{ justifyContent: alignStyle }}
        >
            {isPageInViewRange && (
                <Page
                    devicePixelRatio={Math.min(Math.max(window.devicePixelRatio * 2, zoomScale * 2), 4)}
                    
                    // KUNCI PERBAIKAN: Gunakan width, jangan height
                    width={width} 
                    
                    pageNumber={page}
                    loading={<div className="w-full h-full bg-white/5 animate-pulse" />} 
                    renderAnnotationLayer={false} 
                    renderTextLayer={false}
                    className={styles.pdfCanvas} 
                />
            )}
        </div>
    );
});

PdfPage.displayName = "PdfPage";
export default memo(PdfPage);