import { memo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Maximize,
    Minimize
} from 'lucide-react';
import type { ViewerState } from '../types';
// UPDATE: Import CSS Module
import styles from './ControlBar.module.css';

interface ControlBarProps {
    viewerState: ViewerState;
    totalPages: number;
    onPageChange: (direction: 'next' | 'prev') => void;
    onZoom: (action: 'in' | 'out' | 'reset') => void;
    onToggleFullscreen: () => void;
}

const ControlBar = ({
    viewerState,
    totalPages,
    onPageChange,
    onZoom,
    onToggleFullscreen
}: ControlBarProps) => {

    /**
   * LOGIKA LABEL HALAMAN (2-3 / Total)
   * Menghitung rentang halaman berdasarkan index saat ini.
   */
    const getPageLabel = () => {
        const { currentPage } = viewerState;

        // 1. Cover (Index 0) -> Selalu Single "1 / Total"
        if (currentPage === 0) return `1 / ${totalPages}`;

        // 2. Halaman Spread (2, 3, 4...)
        // React-PageFlip: Index 1 = Hal 2 (Kiri), Index 2 = Hal 3 (Kanan)
        let startPage, endPage;

        if (currentPage % 2 !== 0) {
            // Index Ganjil (1, 3, 5...) -> Halaman Kiri (Awal Spread)
            // Contoh: Index 1 adalah Hal 2. Pasangannya Hal 3.
            startPage = currentPage + 1;
            endPage = startPage + 1;
        } else {
            // Index Genap (2, 4, 6...) -> Halaman Kanan (Akhir Spread)
            // Contoh: Index 2 adalah Hal 3. Pasangannya Hal 2.
            // Kita ingin format tetap "Kecil-Besar" (2-3), jadi start mundur 1.
            endPage = currentPage + 1;
            startPage = endPage - 1;
        }

        // Safety: Pastikan tidak melebihi total halaman
        if (endPage > totalPages) endPage = totalPages;

        // Jika di halaman terakhir dan halamannya ganjil (sendirian), 
        // tampilkan satu angka saja (misal "9 / 9")
        if (startPage === endPage) {
            return `${startPage} / ${totalPages}`;
        }

        // Format Range: "2-3 / 8"
        return `${startPage}-${endPage} / ${totalPages}`;
    };

    return (
        // Gunakan styles.toolbarContainer agar posisi fixed di bawah
        <div className={styles.toolbarContainer}>

            {/* Group 1: Navigasi Halaman */}
            <div className={styles.group}>
                <button
                    onClick={() => onPageChange('prev')}
                    disabled={viewerState.currentPage === 0}
                    className={styles.btn}
                    title="Sebelumnya"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* UPDATE: Menggunakan fungsi getPageLabel() */}
                <span className={styles.pageIndicator}>
                    {getPageLabel()}
                </span>

                <button
                    onClick={() => onPageChange('next')}
                    disabled={viewerState.currentPage >= totalPages - 1}
                    className={styles.btn}
                    title="Selanjutnya"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Group 2: Zoom Controls */}
            <div className={styles.group}>
                <button onClick={() => onZoom('out')} className={styles.btn} title="Zoom Out">
                    <ZoomOut size={18} />
                </button>
                <button onClick={() => onZoom('reset')} className={styles.btn} title="Reset Zoom">
                    <RotateCcw size={16} />
                </button>
                <button onClick={() => onZoom('in')} className={styles.btn} title="Zoom In">
                    <ZoomIn size={18} />
                </button>
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Group 3: Fullscreen */}
            <button onClick={onToggleFullscreen} className={styles.btn} title="Fullscreen">
                {viewerState.isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>

        </div>
    );
};

export default memo(ControlBar);