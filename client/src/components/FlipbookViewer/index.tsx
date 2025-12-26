import React, { useCallback, useState } from "react";
import { Document, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Flipbook from "./flipbook/Flipbook";
import styles from './FlipbookViewer.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;

interface FlipbookViewerProps {
    pdfUrl: string;
    className?: string;
}

const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pdfUrl, className }) => {
    const [pdfLoading, setPdfLoading] = useState(true);
    const [pdfDetails, setPdfDetails] = useState<any>(null);

    const [viewerStates, setViewerStates] = useState({
        currentPageIndex: 0,
        zoomScale: 1, 
    });

    const onDocumentLoadSuccess = useCallback(async (document: any) => {
        try {
            const pageDetails = await document.getPage(1);
            setPdfDetails({
                totalPages: document.numPages,
                width: pageDetails.view[2],
                height: pageDetails.view[3],
            });
            setPdfLoading(false);
        } catch (error) {
            console.error('Error loading document:', error);
        }
    }, []);

    return (
        <div className={`${styles.container} ${className || ''}`} style={{ height: 'auto', minHeight: '500px' }}>
            {pdfLoading && <div className="text-white p-10 text-center">Loading Majalah...</div>}

            <Document 
                file={pdfUrl} 
                onLoadSuccess={onDocumentLoadSuccess} 
                loading={null}
                onLoadError={(error) => console.error("Error Load PDF:", error)}
                className="flex justify-center items-start w-full h-full"
            >
                {(pdfDetails && !pdfLoading) && (
                    <div className={styles.contentWrapper}>
                        <Flipbook
                            viewerStates={viewerStates}
                            setViewerStates={setViewerStates}
                            // HAPUS flipbookRef=null
                            pdfDetails={pdfDetails}
                            // ✅ TAMBAH INI: Kirim URL PDF untuk fitur download
                            pdfUrl={pdfUrl}
                        />
                    </div>
                )}
            </Document>
        </div>
    );
}

export default FlipbookViewer;