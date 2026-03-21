// client/src/components/FlipbookViewer/components/PDFPage/index.tsx
import { forwardRef, memo } from 'react';
import { Page } from 'react-pdf';
import Skeleton from '@mui/material/Skeleton';
import styles from './PDFPage.module.css';

interface PDFPageProps {
    pageNumber: number;
    width: number;
    height: number;
}

const getPixelRatio = () => {
    if (typeof window === 'undefined') return 1;
    return Math.max(window.devicePixelRatio || 1, 2);
};
const PIXEL_RATIO = getPixelRatio();

const PDFPage = forwardRef<HTMLDivElement, PDFPageProps>(({ pageNumber, width, height }, ref) => {
    const alignmentClass = pageNumber % 2 === 0 ? styles.alignLeft : styles.alignRight;

    return (
        <div ref={ref} className={`${styles.pageBase} ${alignmentClass}`}>
            <div className={styles.pdfCanvas}>
                <Page
                    pageNumber={pageNumber}
                    width={width} 
                    scale={1} 
                    devicePixelRatio={PIXEL_RATIO}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                        <Skeleton variant="rectangular" width={width} height={height} animation="wave" />
                    }
                />
            </div>
        </div>
    );
});

PDFPage.displayName = 'PDFPage';
export default memo(PDFPage);