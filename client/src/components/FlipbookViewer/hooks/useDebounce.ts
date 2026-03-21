// client/src/components/FlipbookViewer/hooks/useDebounce.ts
import { useRef, useEffect, useCallback } from 'react';

export function useDebounce<T extends (...args: unknown[]) => void>(callback: T, delay: number) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const debouncedFunction = useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    return debouncedFunction;
}