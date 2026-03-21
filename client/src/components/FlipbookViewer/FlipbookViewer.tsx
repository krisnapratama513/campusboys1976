// client/src/components/FlipbookViewer/FlipbookViewer.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Document, pdfjs } from 'react-pdf';
import screenfull from 'screenfull';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useFlipbookState } from './hooks/useFlipbookState';
import { useAutoFit } from './hooks/useAutoFit'; 
import type { FlipbookHandle } from './types';

import FlipbookBook from './components/FlipbookBook';
import ControlBar from './components/ControlBar';
import { ErrorFallback, LoadingFallback } from './components/ViewerFallbacks';
import styles from './FlipbookViewer.module.css';

if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

interface FlipbookViewerProps {
    pdfUrl: string;
    className?: string;
}

const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pdfUrl, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<FlipbookHandle>(null);
    const [progress, setProgress] = useState(0);

    const {
        isMobile,
        pdfDetails,
        viewerState,
        onDocumentLoadSuccess,
        handleZoom,
        handlePageUpdate,
        handleNavigation,
        setFullscreen, 
        handleAutoFit, 
        resetZoom      
    } = useFlipbookState();

    // PERBAIKAN: Gunakan pemanggilan object params sesuai interface useAutoFit
    const optimalScaleRef = useAutoFit({
        containerRef,
        pdfDetails,
        onScaleCalculated: handleAutoFit
    });

    const toggleFullscreen = useCallback(() => {
        if (screenfull.isEnabled && containerRef.current) {
            screenfull.toggle(containerRef.current);
        }
    }, []);

    useEffect(() => {
        if (!screenfull.isEnabled) return;
        
        const onChange = () => setFullscreen(screenfull.isFullscreen);
        screenfull.on('change', onChange);
        
        return () => { screenfull.off('change', onChange); }; 
    }, [setFullscreen]);

    const handleToolbarPageChange = useCallback((direction: 'next' | 'prev') => {
        handleNavigation(direction, bookRef);
    }, [handleNavigation]);

    const handleToolbarZoom = useCallback((action: 'in' | 'out' | 'reset') => {
        if (action === 'reset') {
            resetZoom(optimalScaleRef.current);
        } else {
            handleZoom(action);
        }
    }, [handleZoom, resetZoom, optimalScaleRef]);

    const handleLoadProgress = useCallback(({ loaded, total }: { loaded: number; total: number }) => {
        if (!total) return;
        setProgress(Math.round((loaded / total) * 100));
    }, []);

    return (
        <div
            ref={containerRef}
            className={`${styles.container} ${className || ''} ${viewerState.isFullscreen ? styles.fullscreen : ''}`}
        >
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadProgress={handleLoadProgress}
                loading={<LoadingFallback progress={progress} />}
                error={<ErrorFallback />}
                className={styles.documentWrapper} 
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
                            currentPage={viewerState.currentPage}
                            isFullscreen={viewerState.isFullscreen}
                            totalPages={pdfDetails.numPages}
                            isMobile={isMobile}
                            mobileView={viewerState.mobileView}
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