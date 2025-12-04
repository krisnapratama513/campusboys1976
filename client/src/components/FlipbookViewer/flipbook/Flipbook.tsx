// client/src/components/FlipbookViewer/flipbook/Flipbook.tsx

import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useMeasure } from 'react-use'; 
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import FlipbookLoader, { type FlipbookHandle } from './FlipbookLoader'; 
import styles from '../FlipbookViewer.module.css';

interface FlipbookProps {
    viewerStates: any;
    setViewerStates: any;
    flipbookRef: any; 
    pdfDetails: any;
}

const Flipbook = memo(({ viewerStates, setViewerStates, pdfDetails }: FlipbookProps) => {
    const [ref, { width }] = useMeasure<HTMLDivElement>();
    const [scale, setScale] = useState(1);
    const [viewRange, setViewRange] = useState([0, 4]);

    const controlRef = useRef<FlipbookHandle>(null);

    // --- LOGIKA NAVIGASI ---
    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation(); 
        controlRef.current?.next();
    }, []);

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        controlRef.current?.prev();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    useEffect(() => {
        if (pdfDetails && width > 0) {
            const fullBookWidth = pdfDetails.width * 2;
            let newScale = (width / fullBookWidth) * 0.9;
            if (newScale > 1.5) newScale = 1.5;
            setScale(newScale);
        }
    }, [pdfDetails, width]);

    useEffect(() => {
        if(viewerStates && pdfDetails) {
            setViewRange([
                Math.max(viewerStates.currentPageIndex - 2, 0), 
                Math.min(viewerStates.currentPageIndex + 2, pdfDetails.totalPages)
            ]);
        }
    }, [viewerStates.currentPageIndex, pdfDetails]);

    // Cek Status Halaman
    const isFirstPage = viewerStates.currentPageIndex === 0;
    const isLastPage = pdfDetails && viewerStates.currentPageIndex >= pdfDetails.totalPages - 1;

    // Style Dasar Tombol
    const baseButtonStyle = "p-3 bg-black/60 text-white rounded-full transition-all shadow-xl backdrop-blur-sm border border-white/10 flex items-center justify-center";
    
    // Style Dinamis (Aktif vs Mati)
    // Jika mati: opacity rendah & cursor not-allowed
    // Jika hidup: hover effect & cursor pointer
    const activeStyle = "hover:bg-black/90 cursor-pointer";
    const disabledStyle = "opacity-30 cursor-not-allowed";

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             
             {/* --- TOMBOL KIRI --- */}
             <div style={{ position: 'absolute', left: '20px', zIndex: 100 }}>
                <button 
                    onClick={handlePrev} 
                    disabled={isFirstPage} // Matikan fungsi klik jika halaman pertama
                    className={`${baseButtonStyle} ${isFirstPage ? disabledStyle : activeStyle}`}
                    aria-label="Previous Page"
                >
                    <ChevronLeft size={28} />
                </button>
             </div>

             {/* --- TOMBOL KANAN --- */}
             <div style={{ position: 'absolute', right: '20px', zIndex: 100 }}>
                <button 
                    onClick={handleNext} 
                    disabled={isLastPage} // Matikan fungsi klik jika halaman terakhir
                    className={`${baseButtonStyle} ${isLastPage ? disabledStyle : activeStyle}`}
                    aria-label="Next Page"
                >
                    <ChevronRight size={28} />
                </button>
             </div>

             {/* --- AREA BUKU --- */}
             {pdfDetails && scale > 0 && (
                <div style={{ padding: '20px 0', zIndex: 10 }}>
                    <FlipbookLoader
                        ref={controlRef} 
                        pdfDetails={pdfDetails}
                        scale={scale}
                        viewRange={viewRange}
                        setViewRange={setViewRange}
                        viewerStates={viewerStates}
                        setViewerStates={setViewerStates}
                    />
                </div>
            )}
        </div>
    );
});

Flipbook.displayName = 'Flipbook';
export default Flipbook;