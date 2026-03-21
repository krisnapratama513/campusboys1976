// client/src/components/FlipbookViewer/hooks/useAutoFit.ts
import { useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import type { PDFDetails } from '../types';

type UseAutoFitParams = {
    containerRef: React.RefObject<HTMLDivElement | null>;
    pdfDetails: PDFDetails | null;
    onScaleCalculated: (scale: number) => void;
};

export function useAutoFit({ containerRef, pdfDetails, onScaleCalculated }: UseAutoFitParams) {
    const optimalScaleRef = useRef<number>(1);

    const calculateScale = useCallback(() => {
        const container = containerRef.current;
        if (!container || !pdfDetails) return;

        const PADDING_FACTOR = 0.95;
        const isMobile = window.innerWidth < 768;

        const containerWidth = container.clientWidth;
        const containerHeight = window.innerHeight * 0.9;

        const totalBookWidth = pdfDetails.width * (isMobile ? 1 : 2);
        const totalBookHeight = pdfDetails.height;

        const scaleX = (containerWidth * PADDING_FACTOR) / totalBookWidth;
        const scaleY = (containerHeight * PADDING_FACTOR) / totalBookHeight;
        

        let finalScale = Math.min(scaleX, scaleY, 1);
        
        // PENTING: Tambahkan fallback ini agar buku tidak hilang (scale 0)
        if (finalScale <= 0 || isNaN(finalScale) || !isFinite(finalScale)) {
            finalScale = 1; 
        }

        optimalScaleRef.current = finalScale;
        onScaleCalculated(finalScale);
    }, [containerRef, pdfDetails, onScaleCalculated]);

    const debouncedCalculate = useDebounce(calculateScale, 150);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        debouncedCalculate();

        const observer = new ResizeObserver(() => {
            debouncedCalculate();
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, [containerRef, debouncedCalculate]);

    return optimalScaleRef;
}