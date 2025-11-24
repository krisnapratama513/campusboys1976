// client/src/types/article.types.ts
// import type { ReactNode } from 'react';

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