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

                <span className={styles.pageIndicator}>
                    {viewerState.currentPage + 1} / {totalPages}
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