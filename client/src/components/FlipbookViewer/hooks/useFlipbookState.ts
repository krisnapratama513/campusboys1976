import { useState, useCallback } from 'react';
import type { PDFDetails, ViewerState } from '../types';

export const useFlipbookState = () => {
    const [pdfDetails, setPdfDetails] = useState<PDFDetails | null>(null);

    // State tunggal untuk UI agar lebih rapi daripada banyak useState terpisah
    const [viewerState, setViewerState] = useState<ViewerState>({
        currentPage: 0,
        zoomScale: 1,
        isFullscreen: false,
        mobileView: 'center', // Default awal (Cover)
    });

    // Handler saat PDF berhasil dimuat oleh react-pdf
    const onDocumentLoadSuccess = useCallback((pdf: any) => {
        // Kita ambil dimensi halaman pertama sebagai referensi rasio aspek
        pdf.getPage(1).then((page: any) => {
            setPdfDetails({
                numPages: pdf.numPages,
                width: page.view[2],
                height: page.view[3],
            });
        });
    }, []);

    // Handler Zoom (In, Out, Reset)
    const handleZoom = useCallback((action: 'in' | 'out' | 'reset') => {
        setViewerState(prev => {
            let newScale = prev.zoomScale;
            if (action === 'in') newScale = Math.min(prev.zoomScale + 0.2, 3); // Max zoom 3x
            if (action === 'out') newScale = Math.max(prev.zoomScale - 0.2, 0.6); // Min zoom 0.6x
            if (action === 'reset') newScale = 1;

            return { ...prev, zoomScale: newScale };
        });
    }, []);

    const handlePageUpdate = useCallback((pageIndex: number) => {
        setViewerState(prev => ({
            ...prev,
            currentPage: pageIndex,
            // PENTING: Setiap kali kertas terbalik (flip), 
            // kembalikan view mobile ke sisi Kiri (awal baca)
            // Kecuali jika balik ke Cover (0), maka 'center'
            mobileView: pageIndex === 0 ? 'center' : 'left'
        }));
    }, []);

    return {
        pdfDetails,
        viewerState,
        setViewerState, // Exposed jika butuh update manual lain
        onDocumentLoadSuccess,
        handleZoom,
        handlePageUpdate
    };
};