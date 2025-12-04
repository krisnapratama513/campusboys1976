// client/src/components/pdf-viewer/MyFlipbook.tsx
import React, { useState, useRef, useCallback } from 'react';
import { Document, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import PDFPage from './PDFPage';

// 1. Setup Worker untuk Vite (WAJIB)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface FlipbookProps {
    pdfUrl: string;
}

export default function MyFlipbook({ pdfUrl }: FlipbookProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const bookRef = useRef<any>(null); // Ref untuk mengontrol buku

    // Callback saat PDF berhasil dimuat
    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    // Fungsi Navigasi Sederhana
    const prevPage = useCallback(() => bookRef.current?.pageFlip().flipPrev(), []);
    const nextPage = useCallback(() => bookRef.current?.pageFlip().flipNext(), []);

    return (
        <div className="flex flex-col items-center gap-4 py-8 bg-gray-50 min-h-screen">

            {/* 2. Komponen Dokumen PDF */}
            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} className="shadow-2xl">
                {/* 3. Komponen Flipbook */}
                {/* @ts-ignore: Library ini kadang rewel soal tipe di TS */}
                <HTMLFlipBook
                    width={400}
                    height={570}
                    showCover={true}
                    ref={bookRef}
                    className="demo-book"
                    maxShadowOpacity={0.5}
                >
                    {/* 4. Looping Halaman */}
                    {Array.from(new Array(numPages), (el, index) => (
                        <PDFPage key={index} pageNumber={index + 1} />
                    ))}
                </HTMLFlipBook>
            </Document>

            {/* 5. Toolbar Sederhana (Ganti Button.tsx nanti) */}
            <div className="flex gap-4 mt-4">
                <button
                    onClick={prevPage}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="py-2 font-medium">
                    Total Halaman: {numPages}
                </span>
                <button
                    onClick={nextPage}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                    Next
                </button>
            </div>
        </div>
    );
}