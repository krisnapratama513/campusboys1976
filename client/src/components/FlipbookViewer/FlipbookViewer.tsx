import React, { useRef, useEffect } from 'react';
import { Document, pdfjs } from 'react-pdf';
import screenfull from 'screenfull';

// Import CSS Wajib react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Import Bagian-bagian yang sudah kita buat
import FlipbookBook from './components/FlipbookBook';
import ControlBar from './components/ControlBar';
import { useFlipbookState } from './hooks/useFlipbookState';

// UPDATE: Menggunakan 'import type' sesuai request
import type { FlipbookHandle } from './types';
import styles from './FlipbookViewer.module.css';

// 1. SETUP WORKER
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FlipbookViewerProps {
    pdfUrl: string;
    className?: string;
}

const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pdfUrl, className }) => {
    // Ref container utama (untuk target Fullscreen)
    const containerRef = useRef<HTMLDivElement>(null);

    // Ref ke komponen Buku (untuk trigger Next/Prev secara imperatif)
    const bookRef = useRef<FlipbookHandle>(null);

    // Ref untuk menyimpan nilai scale optimal (Auto-Fit value)
    const optimalScaleRef = useRef<number>(1);

    // Panggil Custom Hook logic kita
    const {
        pdfDetails,
        viewerState,
        setViewerState,
        onDocumentLoadSuccess,
        handleZoom,
        handlePageUpdate
    } = useFlipbookState();

    /**
     * 2. LOGIKA FULLSCREEN
     */
    const toggleFullscreen = () => {
        if (screenfull.isEnabled && containerRef.current) {
            screenfull.toggle(containerRef.current);
        }
    };

    // Sync state fullscreen
    useEffect(() => {
        if (screenfull.isEnabled) {
            const onChange = () => {
                setViewerState(prev => ({
                    ...prev,
                    isFullscreen: screenfull.isFullscreen
                }));
            };
            screenfull.on('change', onChange);
            return () => screenfull.off('change', onChange);
        }
    }, [setViewerState]);

    /**
     * 3. HANDLER NAVIGASI (SMART MOBILE NAVIGATION)
     * Mengatur logika tombol Next/Prev.
     * Desktop: Langsung Flip.
     * Mobile: Geser (Pan) dulu antar halaman kiri/kanan, baru Flip.
     */
    const handleToolbarPageChange = (direction: 'next' | 'prev') => {
        // Cek apakah layar mobile (< 768px)
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // --- LOGIKA MOBILE ---
            if (direction === 'next') {
                // Case 1: Sedang di Cover -> Flip ke Halaman 1 (View Left)
                if (viewerState.currentPage === 0) {
                    bookRef.current?.next();
                }
                // Case 2: Sedang di Halaman Kiri -> Geser View ke Kanan
                else if (viewerState.mobileView === 'left') {
                    setViewerState(prev => ({ ...prev, mobileView: 'right' }));
                }
                // Case 3: Sedang di Halaman Kanan -> Flip ke Halaman berikutnya (View Left)
                else {
                    bookRef.current?.next();
                }
            } else {
                // --- LOGIKA PREV ---
                // Case 1: Sedang di Halaman Kanan -> Geser View balik ke Kiri
                if (viewerState.mobileView === 'right') {
                    setViewerState(prev => ({ ...prev, mobileView: 'left' }));
                }
                // Case 2: Sedang di Halaman Kiri -> Flip balik ke halaman sebelumnya
                else {
                    bookRef.current?.prev();
                }
            }
        } else {
            // --- LOGIKA DESKTOP (Standard) ---
            if (direction === 'next') bookRef.current?.next();
            else bookRef.current?.prev();
        }
    };

    /**
     * 4. FITUR AUTO-FIT SCALE
     */
    useEffect(() => {
        if (pdfDetails && containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight || window.innerHeight * 0.8;
            const PADDING_FACTOR = 0.95;

            const isMobile = window.innerWidth < 768;
            const totalBookWidth = pdfDetails.width * (isMobile ? 1 : 2);
            const totalBookHeight = pdfDetails.height;

            const scaleX = (containerWidth * PADDING_FACTOR) / totalBookWidth;
            const scaleY = (containerHeight * PADDING_FACTOR) / totalBookHeight;
            const optimalScale = Math.min(scaleX, scaleY);
            const finalScale = Math.min(optimalScale, 1);

            optimalScaleRef.current = finalScale;

            setViewerState(prev => ({
                ...prev,
                zoomScale: finalScale
            }));
        }
    }, [pdfDetails, setViewerState]);

    const handleToolbarZoom = (action: 'in' | 'out' | 'reset') => {
        if (action === 'reset') {
            setViewerState(prev => ({
                ...prev,
                zoomScale: optimalScaleRef.current
            }));
        } else {
            handleZoom(action);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`${styles.container} ${className || ''} ${viewerState.isFullscreen ? 'bg-gray-900 fixed inset-0 z-[9999]' : ''}`}
        >
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className={styles.loadingContainer}>Memuat Majalah...</div>}
                error={<div className="text-red-400 font-bold p-10">Gagal memuat PDF. Pastikan URL benar.</div>}
                className="flex justify-center items-center w-full h-full"
            >
                {pdfDetails && (
                    <>
                        <FlipbookBook
                            ref={bookRef}
                            pdfDetails={pdfDetails}
                            viewerState={viewerState}
                            onPageChange={handlePageUpdate}
                        />

                        <ControlBar
                            viewerState={viewerState}
                            totalPages={pdfDetails.numPages}
                            onPageChange={handleToolbarPageChange}
                            onZoom={handleToolbarZoom}
                            onToggleFullscreen={toggleFullscreen}
                        />
                    </>
                )}
            </Document>
        </div>
    );
};

export default FlipbookViewer;