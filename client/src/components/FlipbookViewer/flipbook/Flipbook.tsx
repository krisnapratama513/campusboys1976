import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useMeasure } from 'react-use';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import screenfull from 'screenfull';

import FlipbookLoader, { type FlipbookHandle } from './FlipbookLoader';
import SliderPageNav from '../toolbar/SliderPageNav';

interface FlipbookProps {
    viewerStates: any;
    setViewerStates: any;
    pdfDetails: any;
    pdfUrl: string;
}

const Flipbook = memo(({ viewerStates, setViewerStates, pdfDetails, pdfUrl }: FlipbookProps) => {
    // 1. REF HANYA UNTUK MENGUKUR (WADAH LUAR)
    const [measureRef, { width }] = useMeasure<HTMLDivElement>();

    const [scale, setScale] = useState(1);
    const [viewRange, setViewRange] = useState([0, 4]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const fullscreenRef = useRef<HTMLDivElement>(null);
    const controlRef = useRef<FlipbookHandle>(null);

    // --- NAVIGASI ---
    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        controlRef.current?.next();
    }, []);

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        controlRef.current?.prev();
    }, []);

    const handleSliderChange = (pageIndex: number) => {
        controlRef.current?.turnToPage(pageIndex);
    };

    // --- FULLSCREEN & DOWNLOAD ---
    const handleToggleFullscreen = () => {
        if (screenfull.isEnabled && fullscreenRef.current) {
            screenfull.toggle(fullscreenRef.current);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = pdfUrl.split('/').pop() || 'majalah.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (screenfull.isEnabled) {
            const onChange = () => setIsFullscreen(screenfull.isFullscreen);
            screenfull.on('change', onChange);
            return () => screenfull.off('change', onChange);
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    // --- LOGIKA SCALE ---
    useEffect(() => {
        if (pdfDetails && width > 0) {
            const fullBookWidth = pdfDetails.width * 2;
            // Gunakan 0.95 agar buku sebesar mungkin tapi ada margin
            let newScale = (width / fullBookWidth) * 0.95;
            if (newScale > 1.4) newScale = 1.4;
            setScale(newScale);
        }
    }, [pdfDetails, width]);

    useEffect(() => {
        if (viewerStates && pdfDetails) {
            setViewRange([
                Math.max(viewerStates.currentPageIndex - 2, 0),
                Math.min(viewerStates.currentPageIndex + 2, pdfDetails.totalPages)
            ]);
        }
    }, [viewerStates.currentPageIndex, pdfDetails]);

    // Centering Logic
    const isFirstPage = viewerStates.currentPageIndex === 0;
    const isLastPage = pdfDetails && viewerStates.currentPageIndex >= pdfDetails.totalPages - 1;
    const singlePageWidth = pdfDetails ? pdfDetails.width * scale : 0;
    let translateX = 0;
    if (isFirstPage) translateX = -singlePageWidth / 2;
    else if (isLastPage && pdfDetails.totalPages % 2 === 0) translateX = singlePageWidth / 2;

    const visualBookWidth = pdfDetails ? (pdfDetails.width * scale * 2) : '100%';
    const baseButtonStyle = "p-3 bg-black/60 text-white rounded-full transition-all shadow-xl backdrop-blur-sm border border-white/10 flex items-center justify-center";
    const activeStyle = "hover:bg-black/90 cursor-pointer";
    const disabledStyle = "opacity-0 pointer-events-none";

    // PERBAIKAN CLASS: Hapus overflow-hidden agar bayangan buku tidak terpotong
    const containerClass = isFullscreen
        ? "fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center h-screen w-screen"
        : "relative w-full min-h-[600px] h-full flex flex-col items-center justify-center";

    return (
        <div ref={measureRef} style={{ width: '100%', height: '100%', position: 'relative' }}>

            <div ref={fullscreenRef} className={containerClass}>

                {/* TOMBOL KIRI */}
                <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 100 }}>
                    <button
                        onClick={handlePrev} disabled={isFirstPage}
                        className={`${baseButtonStyle} ${isFirstPage ? disabledStyle : activeStyle}`}
                    >
                        <ChevronLeft size={28} />
                    </button>
                </div>

                {/* TOMBOL KANAN */}
                <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 100 }}>
                    <button
                        onClick={handleNext} disabled={isLastPage}
                        className={`${baseButtonStyle} ${isLastPage ? disabledStyle : activeStyle}`}
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>

                {/* AREA BUKU */}
                {/* flex: 1 akan mengisi sisa ruang, memastikan buku tidak tertimpa slider */}
                {pdfDetails && scale > 0 && (
                    <div
                        style={{
                            padding: '20px 0',
                            zIndex: 10,
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: `translateX(${translateX}px)`,
                            transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            width: '100%'
                        }}
                    >
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

                {/* SLIDER & TOOLBAR */}
                {/* PERBAIKAN: Hapus 'absolute bottom-0'. Biarkan dia di flow normal (bawah buku) */}
                {pdfDetails && (
                    <div
                        className="z-50 pb-6 pt-2 flex justify-center w-full"
                        style={{ width: visualBookWidth, maxWidth: '90%', margin:'auto' }}
                    >
                        <SliderPageNav
                            totalPages={pdfDetails.totalPages}
                            currentPage={viewerStates.currentPageIndex}
                            onPageChange={handleSliderChange}
                            onToggleFullscreen={handleToggleFullscreen}
                            isFullscreen={isFullscreen}
                            onDownload={handleDownload}
                        />
                    </div>
                )}

                
            </div>


        </div>
    );
});

Flipbook.displayName = 'Flipbook';
export default Flipbook;