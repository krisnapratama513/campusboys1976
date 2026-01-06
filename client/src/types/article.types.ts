// client/src/types/article.types.ts

/**
 * Tipe data mentah (raw) yang datang dari API
 * (Sesuai dengan apa yang dikirim server).
 */
export type ApiArticleCard = {
    id: number;
    slug: string;
    img: string;
    title: string;
    created_at: string; // Ini adalah string (ISO Date)
    description: string;
    author_name: string;
};

/**
 * Tipe data (Props) yang dibutuhkan oleh
 * komponen UI <ArticleCard />.
 */
export type ArticleCardProps = {
    href: string;
    imgFilename: string;
    author: string;
    date: string;
    title: string;
    description: string;
};


export type FullArticleDetail = {
    // id: number;
    // slug: string;
    // img: string;
    // title: string;
    // created_at: string;
    // content: string; // Konten lengkap (HTML/string)
    // author_name: string; // Sesuaikan dengan key 'author_name' dari API

    id: number;
    id_author: number; // Admin butuh ini untuk edit
    author_name?: string;
    title: string;
    slug: string;
    img: string;
    content: string;
    description: string;
    status: 'publish' | 'pending'; // Admin butuh ini
    password?: string; // Admin butuh ini (opsional)
    created_at: string;
};