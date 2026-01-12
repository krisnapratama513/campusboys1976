// client/src/components/PhotoModal/index.tsx

import { useEffect } from 'react';
import styles from './PhotoModal.module.css';
import { API_BASE_URL } from '../../config/api'; // [PENTING]

type PhotoModalProps = {
    imageFilename: string | null;
    onClose: () => void;
};

/**
 * Komponen Modal: Menampilkan foto ukuran penuh (Zoom).
 * Fitur:
 * - Backdrop click to close.
 * - ESC key to close.
 * - Mengambil gambar dari Server Uploads.
 */
const PhotoModal = ({ imageFilename, onClose }: PhotoModalProps) => {
    
    // Helper: Root URL Server
    const serverRoot = API_BASE_URL.replace('/api', '');

    // Logic: Jika tidak ada foto dipilih, jangan render apapun
    if (!imageFilename) return null;

    // Effect: Tutup modal saat tekan tombol ESC
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        
        // Cleanup listener
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            {/* Tombol Close Fixed di Pojok Kanan Atas */}
            <button className={styles.closeButton} onClick={onClose}>
                &times;
            </button>

            {/* Container Gambar (Stop Propagation agar klik gambar tidak menutup modal) */}
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                
                {/* [UPDATE] Gunakan URL Server yang benar */}
                <img 
                    src={`${serverRoot}/uploads/albums/gallery/${imageFilename}`} 
                    alt="Full preview" 
                    className={styles.image}
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/800x600?text=Image+Not+Found')}
                />
            </div>
        </div>
    );
};

export default PhotoModal;