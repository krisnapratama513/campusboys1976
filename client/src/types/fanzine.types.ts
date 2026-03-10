/**
 * Tipe data (Props) yang dibutuhkan oleh
 * komponen UI < />.
 */
export type FanzineCardProps = {
    href: string;
    imgFilename: string;
    author: string;
    date: string;
    title: string;
};

/**
 * ==============================================================================
 * FANZINE TYPES
 * ==============================================================================
 */

export type FanzineType = {
    id: number;
    title: string;
    date: string; // Format ISO string dari DB
    slug: string;
    
    // Filename dari DB
    imgFilename: string; 
    pdfFilename: string;
    
    // Join Data
    author_name: string;
    author_id: number;
};

// [TAMBAHAN] Tipe Pagination
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

export interface PublicFanzinesResponse {
    message: string;
    data: FanzineType[];
    pagination: PaginationMeta;
}