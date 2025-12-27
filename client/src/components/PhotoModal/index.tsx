import { useEffect } from 'react';
import styles from './PhotoModal.module.css';

type PhotoModalProps = {
    imageFilename: string | null;
    onClose: () => void;
};

const PhotoModal = ({ imageFilename, onClose }: PhotoModalProps) => {
    
    // Logic: Jika tidak ada foto dipilih, jangan render apapun
    if (!imageFilename) return null;

    // Logic: Tutup modal saat tekan tombol ESC
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        // Membersihkan event listener saat component di-unmount (ditutup)
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            {/* Tombol Close Fixed di Pojok Kanan Atas Layar */}
            <button className={styles.closeButton} onClick={onClose}>
                &times;
            </button>

            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <img 
                    src={`/album/${imageFilename}`} 
                    alt="Full preview" 
                    className={styles.image}
                />
            </div>
        </div>
    );
};

export default PhotoModal;