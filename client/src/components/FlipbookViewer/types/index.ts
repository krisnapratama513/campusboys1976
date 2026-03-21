// client/src/components/FlipbookViewer/types/index.ts
export interface PDFDetails {
    readonly numPages: number;
    readonly width: number;
    readonly height: number;
}

export interface ViewerState {
    readonly currentPage: number;
    readonly zoomScale: number;
    readonly isFullscreen: boolean;
    readonly mobileView: 'center' | 'left' | 'right'; 
    readonly isManualZoom: boolean;
}

export interface FlipbookHandle {
    next: () => void;
    prev: () => void;
    goToPage: (index: number) => void;
}