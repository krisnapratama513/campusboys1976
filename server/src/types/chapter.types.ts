// server/src/types/chapter.types.ts

/**
 * ==============================================================================
 * CHAPTER TYPES DEFINITION
 * ==============================================================================
 * Definisi tipe data untuk entitas Chapter.
 * Digunakan untuk mapping hasil query database (MySQL) ke object TypeScript.
 */

import { RowDataPacket } from "mysql2";

/**
 * Representasi satu baris data dari tabel 'chapters'.
 * Meng-extend RowDataPacket agar kompatibel dengan output query mysql2.
 */
export interface Chapter extends RowDataPacket {
    /** * Primary Key (Auto Increment) 
     */
    id: number;

    /** * Nama Wilayah/Cabang (misal: "Chapter Sleman").
     * Wajib ada (NOT NULL).
     */
    name: string;

    /** * Deskripsi singkat profil chapter.
     * Bersifat opsional (Boleh NULL di database).
     */
    description: string | null;

    /** * Nama file gambar logo yang tersimpan di server.
     * Contoh: "1_AMIKOM.png".
     * Lokasi fisik: server/uploads/chapters/
     * Bersifat opsional (Boleh NULL).
     */
    img: string | null;
}