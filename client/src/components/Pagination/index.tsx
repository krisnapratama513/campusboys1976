import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Jika hanya 1 halaman, tidak perlu tampilkan pagination
    if (totalPages <= 1) return null;

    // Fungsi untuk membuat deretan angka dan titik-titik secara dinamis
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        
        // Jika total halaman 5 atau kurang, tampilkan semua (1 2 3 4 5)
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Jika sedang di halaman awal (1, 2, 3) -> 1 2 3 4 ... 10
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } 
            // Jika sedang di halaman akhir (8, 9, 10) -> 1 ... 7 8 9 10
            else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } 
            // Jika sedang di halaman tengah (misal 5) -> 1 ... 4 5 6 ... 10
            else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className={styles.paginationContainer}>
            {/* Tombol Previous */}
            <button
                className={styles.navButton}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            {/* Render Angka Halaman / Titik-titik */}
            {pages.map((page, index) => {
                // Jika isinya adalah string '...', render sebagai text biasa
                if (page === '...') {
                    return <span key={`dots-${index}`} className={styles.dots}>...</span>;
                }

                // Jika isinya angka, render sebagai tombol
                return (
                    <button
                        key={page}
                        className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                        onClick={() => onPageChange(page as number)}
                        disabled={currentPage === page}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Tombol Next */}
            <button
                className={styles.navButton}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    );
};

export default Pagination;