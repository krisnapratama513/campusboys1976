/**
 * ==============================================================================
 * FANZINE TYPES DEFINITION
 * ==============================================================================
 */

import { RowDataPacket } from "mysql2";

export interface Fanzine extends RowDataPacket {
    id: number;
    title: string;
    date: Date;
    slug: string;
    imgFilename: string | null; // Cover Image
    pdfFilename: string | null; // File PDF
    author_id: number;
    author_name?: string; // Dari Join
    created_at?: Date;
}

// Tipe data untuk input saat create/update
export interface FanzineInput {
    title: string;
    date: string;
    author_id: number;
}