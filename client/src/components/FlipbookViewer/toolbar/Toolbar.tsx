import React, { useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import screenfull from 'screenfull';
import Zoom from './Zoom';

interface ToolbarProps {
    viewerStates: any;
    setViewerStates: any;
    flipbookRef: any;
    pdfDetails: any;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
    viewerStates, 
    setViewerStates, 
    flipbookRef, 
    pdfDetails 
}) => {
    
    // Fungsi Navigasi Halaman
    const handlePageChange = useCallback((direction: 'next' | 'prev') => {
        if (flipbookRef.current) {
            const pageFlip = flipbookRef.current.pageFlip();
            if (direction === 'next') pageFlip.flipNext();
            else pageFlip.flipPrev();
        }
    }, [flipbookRef]);

    // Fungsi Toggle Fullscreen
    const toggleFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle();
        }
    };

    const isFullscreen = screenfull.isEnabled && screenfull.isFullscreen;

    // Hitung halaman saat ini untuk display (misal: "Halaman 1-2 dari 20")
    // Logika flipbook: index 0 = cover, index 1 = page 1, index 2 = page 2...
    // Tampilan user friendly mungkin perlu disesuaikan, tapi ini basic-nya:
    const currentPageDisplay = viewerStates.currentPageIndex + 1;

    return (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
            {/* pointer-events-auto PENTING agar tombol bisa diklik 
                meskipun containernya pointer-events-none (agar tidak menghalangi klik buku) 
            */}
            <div className="bg-black/80 backdrop-blur-md text-white rounded-xl px-4 py-2 flex items-center gap-6 shadow-2xl border border-white/10 pointer-events-auto">
                
                {/* 1. Tombol Previous */}
                <button 
                    onClick={() => handlePageChange('prev')}
                    disabled={viewerStates.currentPageIndex === 0}
                    className="hover:text-blue-400 disabled:opacity-30 disabled:hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* 2. Indikator Halaman */}
                <span className="text-sm font-medium tabular-nums min-w-[80px] text-center">
                    {currentPageDisplay} / {pdfDetails?.totalPages || '-'}
                </span>

                {/* 3. Tombol Next */}
                <button 
                    onClick={() => handlePageChange('next')}
                    disabled={pdfDetails && viewerStates.currentPageIndex >= pdfDetails.totalPages - 1}
                    className="hover:text-blue-400 disabled:opacity-30 disabled:hover:text-white transition-colors"
                >
                    <ChevronRight size={24} />
                </button>

                <div className="w-px h-6 bg-white/20 mx-2" /> {/* Divider */}

                {/* 4. Zoom Controls */}
                <Zoom 
                    viewerStates={viewerStates} 
                    setViewerStates={setViewerStates} 
                />

                <div className="w-px h-6 bg-white/20 mx-2" /> {/* Divider */}

                {/* 5. Fullscreen Toggle */}
                <button 
                    onClick={toggleFullscreen}
                    className="hover:text-blue-400 transition-colors"
                    title="Fullscreen"
                >
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
            </div>
        </div>
    );
};

export default Toolbar;