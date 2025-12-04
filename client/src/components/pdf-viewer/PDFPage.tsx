// client/src/components/pdf-viewer/PDFPage.tsx
import React, { forwardRef } from 'react';
import { Page } from 'react-pdf';

interface PageProps {
    pageNumber: number;
}

const PDFPage = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
    return (
        <div className="page-content bg-white shadow-md border-r border-gray-200" ref={ref}>
            <Page
                pageNumber={props.pageNumber}
                width={400} // Lebar tetap dulu agar layout tidak pecah
                renderAnnotationLayer={false}
                renderTextLayer={false}
            />
        </div>
    );
});

PDFPage.displayName = 'PDFPage';
export default PDFPage;