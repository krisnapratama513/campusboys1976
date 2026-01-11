// client/src/types/chapter.types.ts
export interface Chapter {
    id: number;
    name: string;
    description: string;
    img: string;
}

// Tipe khusus untuk endpoint yang hanya mengambil ID dan Gambar
export interface ChapterImage {
    id: number;
    img: string;
}