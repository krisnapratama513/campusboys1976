// server/src/services/album.service.ts

import { pool } from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { Album, AlbumPhoto } from '../types/album.types'; // Pastikan file types sudah dibuat sesuai langkah sebelumnya

// ==========================================
// BAGIAN 1: PUBLIC (UNTUK WEBSITE PENGUNJUNG)
// ==========================================

// Hanya ambil yang status = 'publish'
export const fetchAllPublishedAlbums = async () => {
    const [rows] = await pool.execute<Album[]>(
        `SELECT
            id,
            title,
            name,
            description,
            image,
            date
        FROM album
        WHERE status = 'publish'
        ORDER BY date DESC`
    );
    return rows;
};

// Detail untuk pengunjung (hanya publish)
export const fetchPublicAlbumDetail = async (slugOrId: string) => {
    
    // 1. Ambil Album
    const [albumRows] = await pool.execute<Album[]>(
        `SELECT * FROM album WHERE (name = ? OR id = ?) AND status = 'publish'`,
        [slugOrId, slugOrId]
    );

    // --- PERBAIKAN DI SINI ---
    const album = albumRows[0]; // Ambil dulu
    
    // Cek apakah 'album' ada isinya? Jika tidak (undefined), return null.
    if (!album) return null; 
    // -------------------------

    // 2. Ambil Foto (Sekarang TypeScript tahu 'album' pasti ada isinya)
    const [photoRows] = await pool.execute<AlbumPhoto[]>(
        `SELECT * FROM photo WHERE album_id = ? ORDER BY created_at DESC`,
        [album.id]
    );

    return { ...album, photos: photoRows };
};

// ==========================================
// BAGIAN 2: ADMIN (UNTUK DASHBOARD CRUD)
// ==========================================

// 1. GET ALL (Admin butuh lihat status 'pending' juga)
export const getAllAlbums = async () => {
    const [rows] = await pool.execute<Album[]>(
        `SELECT * FROM album ORDER BY date DESC`
    );
    return rows;
};

// 2. GET BY ID (Untuk Form Edit Admin)
export const getAlbumById = async (id: number) => {
    // Admin boleh lihat data walau status pending
    const [albumRows] = await pool.execute<Album[]>(`SELECT * FROM album WHERE id = ?`, [id]);
    const album = albumRows[0];

    if (!album) return null;

    const [photoRows] = await pool.execute<AlbumPhoto[]>(
        `SELECT * FROM photo WHERE album_id = ? ORDER BY created_at DESC`, 
        [id]
    );

    return { ...album, photos: photoRows };
};

// 3. CREATE ALBUM (Insert Data Dasar)
export const createAlbumInitial = async (data: any) => {
    const { title, name, description, image, date, status } = data;
    
    // Masukkan data dasar album
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO album (title, name, description, image, date, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, name, description, image, date, status]
    );
    return result.insertId;
};

// 4. INSERT PHOTOS (Bulk Insert - Banyak sekaligus)
export const addAlbumPhotos = async (albumId: number, filenames: string[]) => {
    if (filenames.length === 0) return;

    // Membuat placeholder dinamis (?, ?), (?, ?) sesuai jumlah file
    const placeholder = filenames.map(() => `(?, ?)`).join(', ');
    const values: (string|number)[] = [];
    
    filenames.forEach(fname => {
        values.push(albumId);
        values.push(fname);
    });

    await pool.execute(
        `INSERT INTO photo (album_id, image_filename) VALUES ${placeholder}`,
        values
    );
};

// 5. UPDATE ALBUM INFO
export const updateAlbumInfo = async (id: number, data: { name?: string, image?: string, title?: string, description?: string, status?: string, date?: string }) => {
    let sql = `UPDATE album SET `;
    const params: (string|number)[] = [];
    const updates: string[] = [];

    // Cek field apa saja yang dikirim untuk diupdate
    if (data.title) { updates.push(`title = ?`); params.push(data.title); }
    if (data.description) { updates.push(`description = ?`); params.push(data.description); }
    if (data.status) { updates.push(`status = ?`); params.push(data.status); }
    if (data.date) { updates.push(`date = ?`); params.push(data.date); }
    if (data.name) { updates.push(`name = ?`); params.push(data.name); } // Slug
    if (data.image) { updates.push(`image = ?`); params.push(data.image); } // Cover

    if (updates.length === 0) return;

    sql += updates.join(', ') + ` WHERE id = ?`;
    params.push(id);

    await pool.execute(sql, params);
};

// 6. DELETE PHOTO (Single Photo dari Gallery)
export const deletePhotoById = async (photoId: number) => {
    // Ambil data dulu (buat return nama file biar controller bisa hapus fisik)
    const [rows] = await pool.execute<AlbumPhoto[]>(`SELECT * FROM photo WHERE id = ?`, [photoId]);
    if (rows.length === 0) return null;

    await pool.execute(`DELETE FROM photo WHERE id = ?`, [photoId]);
    return rows[0]; 
};

// 7. DELETE ALBUM
export const deleteAlbum = async (id: number) => {
    // Ambil list foto dulu untuk dihapus fisiknya nanti
    const [photos] = await pool.execute<AlbumPhoto[]>(`SELECT * FROM photo WHERE album_id = ?`, [id]);
    
    // Hapus album (karena foreign key, foto di DB mungkin otomatis hilang atau perlu dihapus manual tergantung setting DB)
    // Kita asumsikan hapus manual atau cascade di DB.
    // Query ini menghapus data albumnya
    await pool.execute(`DELETE FROM album WHERE id = ?`, [id]);
    
    // Hapus foto-fotonya dari tabel photo (jika DB tidak ON DELETE CASCADE)
    await pool.execute(`DELETE FROM photo WHERE album_id = ?`, [id]);
    
    return photos; // Return data foto agar controller bisa hapus file fisiknya
};