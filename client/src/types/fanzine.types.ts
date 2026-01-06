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

export type FanzineType = {
    id: number;
    title: string;
    date: string;
    slug:string;
    imgFilename: string;
    pdfFilename: string;
    author_name: string;

    author_id: number;
}