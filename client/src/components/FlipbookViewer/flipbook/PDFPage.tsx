// client/src/components/FlipbookViewer/flipbook/PDFPage.tsx

import React, { forwardRef, memo } from 'react';
import { Page } from 'react-pdf';
import styles from '../FlipbookViewer.module.css';

interface PdfPageProps {
    page: number;
    width: number;
    height: number;
    zoomScale: number;
    // HAPUS: isPageInView: boolean;
    isPageInViewRange: boolean;
}

const PdfPage = forwardRef<HTMLDivElement, PdfPageProps>(({ 
    page, 
    width, 
    height,
    zoomScale, 
    // HAPUS: isPageInView (tidak dipakai lagi)
    isPageInViewRange 
}, ref) => {
    
    const alignStyle = page % 2 === 0 ? 'flex-end' : 'flex-start';

    // Optimasi Kualitas Gambar:
    // Kita gunakan resolusi tinggi (2x) secara default agar tidak burik.
    // Tidak lagi bergantung pada status 'isPageInView'.
    const pixelRatio = Math.min(Math.max(window.devicePixelRatio * 2, zoomScale * 2), 4);

    return (
        <div 
            ref={ref} 
            className={`${styles.pageBase} ${styles.pageBackground}`}
            style={{ justifyContent: alignStyle }}
        >
            {/* Hanya render jika masuk range lazy loading */}
            {isPageInViewRange && (
                <Page
                    devicePixelRatio={pixelRatio}
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
// Memo sangat penting di sini! 
// Karena kita menghapus isPageInView, props lain (width, page, zoomScale) tidak berubah saat flip.
// Jadi React akan SKIP render ulang = TIDAK FLICKER.
export default memo(PdfPage);