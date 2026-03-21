// client/src/components/FlipbookViewer/components/ControlBar/index.tsx
import { memo } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Maximize, Minimize } from 'lucide-react';
import styles from './ControlBar.module.css';

const formatPageLabel = (currentPageIndex: number, totalPages: number): string => {
    if (currentPageIndex === 0) return `1 / ${totalPages}`; // Cover

    const leftPageNum = currentPageIndex + 1;
    const rightPageNum = leftPageNum + 1;

    if (leftPageNum >= totalPages) return `${totalPages} / ${totalPages}`;
    return `${leftPageNum}-${rightPageNum} / ${totalPages}`;
};

// PERBAIKAN: Menambahkan isMobile dan mobileView agar tidak error saat dipanggil di FlipbookViewer
interface ControlBarProps {
    currentPage: number;
    isFullscreen: boolean;
    totalPages: number;
    isMobile: boolean;
    mobileView: 'center' | 'left' | 'right';
    onPageChange: (direction: 'next' | 'prev') => void;
    onZoom: (action: 'in' | 'out' | 'reset') => void;
    onToggleFullscreen: () => void;
}

const ControlBar = ({
    currentPage,
    isFullscreen,
    totalPages,
    onPageChange,
    onZoom,
    onToggleFullscreen
}: ControlBarProps) => {

    return (
        <div className={styles.toolbarContainer}>
            <div className={styles.group}>
                <button
                    onClick={() => onPageChange('prev')}
                    disabled={currentPage === 0}
                    className={styles.btn}
                    title="Sebelumnya"
                >
                    <ChevronLeft size={20} />
                </button>

                <span className={styles.pageIndicator}>
                    {formatPageLabel(currentPage, totalPages)}
                </span>

                <button
                    onClick={() => onPageChange('next')}
                    disabled={currentPage >= totalPages - 1}
                    className={styles.btn}
                    title="Selanjutnya"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
                <button onClick={() => onZoom('out')} className={styles.btn} title="Zoom Out"><ZoomOut size={18} /></button>
                <button onClick={() => onZoom('reset')} className={styles.btn} title="Reset Zoom"><RotateCcw size={16} /></button>
                <button onClick={() => onZoom('in')} className={styles.btn} title="Zoom In"><ZoomIn size={18} /></button>
            </div>

            <div className={styles.divider} />

            <button onClick={onToggleFullscreen} className={styles.btn} title="Fullscreen">
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
        </div>
    );
};

export default memo(ControlBar);