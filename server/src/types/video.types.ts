import { RowDataPacket } from "mysql2";

export interface Video extends RowDataPacket {
    id: number;
    title: string;
    youtube_id: string; // Kode unik "sGYuS13qsOo"
    is_active: number;  // 1 atau 0 (TinyInt)
    description: string | null;
}