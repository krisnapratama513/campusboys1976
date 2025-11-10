// src/types/article.ts
import type { ReactNode } from 'react';

export interface Article {
    id: string;
    slug: string;
    imgFilename: string;
    author: string;
    date: string;
    title: string;
    description: ReactNode;
    content: ReactNode;
}