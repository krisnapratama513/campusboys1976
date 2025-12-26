// client/src/components/FlipbookViewer/types/index.ts

export interface PDFDetails {
    numPages: number;
    width: number;
    height: number;
}

export interface ViewerState {
    currentPage: number; // Index halaman (0, 1, 2...)
    zoomScale: number;
    isFullscreen: boolean;
}

// Interface untuk Ref agar bisa diakses parent
export interface FlipbookHandle {
    next: () => void;
    prev: () => void;
    goToPage: (index: number) => void;
}