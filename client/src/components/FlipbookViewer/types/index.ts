// client/src/components/FlipbookViewer/types/index.ts

export interface PDFDetails {
    numPages: number;
    width: number;
    height: number;
}

export interface ViewerState {
  currentPage: number;
  zoomScale: number;
  isFullscreen: boolean;
  // TAMBAHAN: Melacak sisi mana yang sedang dilihat di HP
  // 'center' = Cover, 'left' = Halaman Kiri (Genap), 'right' = Halaman Kanan (Ganjil)
  mobileView: 'center' | 'left' | 'right'; 
}

// Interface untuk Ref agar bisa diakses parent
export interface FlipbookHandle {
    next: () => void;
    prev: () => void;
    goToPage: (index: number) => void;
}