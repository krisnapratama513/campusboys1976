// client/src/components/FlipbookViewer/hooks/useFlipbookState.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import type { PDFDetails, ViewerState, FlipbookHandle } from '../types';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import useMediaQuery from '@mui/material/useMediaQuery';

const ZOOM = { STEP: 0.2, MAX: 3, MIN: 0.4 };

export const useFlipbookState = () => {
    const isMobile = useMediaQuery('(max-width:768px)');
    const [pdfDetails, setPdfDetails] = useState<PDFDetails | null>(null);
    const [viewerState, setViewerState] = useState<ViewerState>({
        currentPage: 0,
        zoomScale: 1,
        isFullscreen: false,
        mobileView: 'center', 
        isManualZoom: false,
    });

    const stateRef = useRef(viewerState);
    stateRef.current = viewerState;

    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true; // Tambahkan ini agar aman di Strict Mode
        return () => { isMounted.current = false; };
    }, []);

    const onDocumentLoadSuccess = useCallback(async (pdf: PDFDocumentProxy) => {
        try {
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1 }); // Ganti jadi ini
            
            if (isMounted.current) {
                setPdfDetails({
                    numPages: pdf.numPages,
                    width: viewport.width,   // Gunakan viewport
                    height: viewport.height, // Gunakan viewport
                });
            }
        } catch (error) {
            console.error("Gagal merender:", error);
        }
    }, []);

    const handleZoom = useCallback((action: 'in' | 'out') => {
        setViewerState(prev => {
            let newScale = prev.zoomScale;
            if (action === 'in') newScale = Math.min(prev.zoomScale + ZOOM.STEP, ZOOM.MAX); 
            if (action === 'out') newScale = Math.max(prev.zoomScale - ZOOM.STEP, ZOOM.MIN); 
            
            return { ...prev, zoomScale: newScale, isManualZoom: true }; 
        });
    }, []);

    const handlePageUpdate = useCallback((pageIndex: number) => {
        setViewerState(prev => ({
            ...prev,
            currentPage: pageIndex,
            mobileView: pageIndex === 0 ? 'center' : 'left'
        }));
    }, []);

    const handleNavigation = useCallback((
        direction: 'next' | 'prev', 
        bookRef: React.RefObject<FlipbookHandle | null>
    ) => {
        const book = bookRef.current;
        if (!book) return;

        const current = stateRef.current; 

        if (!isMobile) {
            if (direction === 'next') book.next();
            else book.prev();
            return;
        }

        if (direction === 'next') {
            if (current.currentPage === 0) book.next();
            else if (current.mobileView === 'left') setViewerState(prev => ({ ...prev, mobileView: 'right' }));
            else book.next();
        } else {
            if (current.mobileView === 'right') setViewerState(prev => ({ ...prev, mobileView: 'left' }));
            else book.prev();
        }
    }, [isMobile]); 

    const setFullscreen = useCallback((isFullscreen: boolean) => {
        setViewerState(prev => ({ ...prev, isFullscreen }));
    }, []);

    const resetZoom = useCallback((optimalScale: number) => {
        setViewerState(prev => ({ ...prev, zoomScale: optimalScale, isManualZoom: false }));
    }, []);

    const handleAutoFit = useCallback((calculatedScale: number) => {
        setViewerState(prev => {
            if (prev.isManualZoom) return prev; 
            return { ...prev, zoomScale: calculatedScale };
        });
    }, []);

    return {
        isMobile,
        pdfDetails,
        viewerState,
        onDocumentLoadSuccess,
        handleZoom,
        handlePageUpdate,
        handleNavigation,
        setFullscreen,
        resetZoom,
        handleAutoFit
    };
};