import { RowDataPacket } from "mysql2";

export interface Chapter extends RowDataPacket {
    id: number;
    name: string;
    description: string | null;
    img: string | null;
}