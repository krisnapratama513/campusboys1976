import { forwardRef, memo, useMemo } from 'react';
import { Page } from 'react-pdf';
import styles from '../FlipbookViewer.module.css';

interface PDFPageProps {
    pageNumber: number;
    width: number;
    height: number;
    zoomScale: number;
}

/**
 * PDFPage Component
 * * Komponen ini bertanggung jawab merender satu halaman PDF.
 * Menggunakan forwardRef karena diperlukan oleh library 'react-pageflip'.
 */
const PDFPage = forwardRef<HTMLDivElement, PDFPageProps>(({
    pageNumber,
    width,
    height,
    zoomScale
}, ref) => {

    // Menentukan posisi konten halaman (Kiri/Kanan) agar terlihat seperti buku
    // Halaman genap (2, 4, ...) rata kiri, Ganjil (1, 3, ...) rata kanan (opsional, tergantung desain)
    const justifyContent = pageNumber % 2 === 0 ? 'flex-start' : 'flex-end';

    /**
     * Optimasi Kualitas Rendering (Pixel Ratio)
     * * Kita menghitung resolusi gambar berdasarkan zoom level.
     * - Minimal 2x devicePixelRatio agar teks tajam.
     * - Maksimal 4x agar memori browser tidak jebol (crash).
     */
    const pixelRatio = useMemo(() => {
        const baseRatio = window.devicePixelRatio || 1;
        // Scale dikali 2 untuk ketajaman ekstra, tapi di-cap di angka 4
        return Math.min(Math.max(baseRatio * 2, zoomScale * 2), 4);
    }, [zoomScale]);

    return (
        <div
            ref={ref}
            className={styles.pageBase}
            style={{ justifyContent }}
        >
            <div className={styles.pdfCanvas}>
                <Page
                    pageNumber={pageNumber}
                    width={width} // react-pdf akan otomatis menghitung tinggi (aspect ratio maintain)
                    scale={1} // Kita handle scaling via container/zoomScale, bukan prop scale ini
                    devicePixelRatio={pixelRatio}

                    // Performance Tuning: Matikan layer teks & anotasi jika tidak butuh select text
                    renderTextLayer={false}
                    renderAnnotationLayer={false}

                    // Loading Placeholder (Skeleton sederhana)
                    loading={
                        <div
                            style={{ width: width, height: height }}
                            className="w-full h-full bg-gray-700 animate-pulse"
                        />
                    }
                />
            </div>
        </div>
    );
});

// Display name untuk debugging di React DevTools
PDFPage.displayName = 'PDFPage';

/**
 * Export dengan Memo
 * * Sangat PENTING: Mencegah re-render yang tidak perlu saat animasi flip berjalan.
 * Halaman hanya akan render ulang jika props (zoom, width, pageNumber) berubah.
 */
export default memo(PDFPage);