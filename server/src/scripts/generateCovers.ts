import fs from 'fs';
import path from 'path';
import { pool } from '../index'; // Sesuaikan path ke koneksi database Anda

// Mundur 3 langkah ke Root Project -> Masuk ke client -> Masuk ke public -> album
const SOURCE_DIR = path.join(__dirname, '../../../client/public/album'); 
const TARGET_DIR = path.join(__dirname, '../../../client/public/album/0-cover');

const generateCovers = async () => {
    let connection;
    try {
        console.log('🚀 Memulai proses generate cover...');
        
        // Pastikan folder tujuan ada
        if (!fs.existsSync(TARGET_DIR)){
            fs.mkdirSync(TARGET_DIR, { recursive: true });
        }

        connection = await pool.getConnection();

        // 1. Ambil album yang covernya masih 'default.jpg' DAN punya setidaknya satu foto
        // Kita ambil foto dengan ID terkecil (foto pertama diupload) sebagai cover
        const [rows]: any = await connection.execute(`
            SELECT a.id as album_id, p.image_filename 
            FROM album a
            JOIN photo p ON a.id = p.album_id
            WHERE a.image = 'default.jpg'
            GROUP BY a.id
        `);

        if (rows.length === 0) {
            console.log('✅ Tidak ada album yang perlu diupdate.');
            return;
        }

        console.log(`📦 Ditemukan ${rows.length} album untuk diproses.`);

        for (const row of rows) {
            const { album_id, image_filename } = row;
            const sourcePath = path.join(SOURCE_DIR, image_filename);
            const targetPath = path.join(TARGET_DIR, image_filename);

            // 2. Cek apakah file fisik foto detailnya ada?
            if (fs.existsSync(sourcePath)) {
                
                // 3. Copy file ke folder 0-cover (jika belum ada)
                try {
                    if (!fs.existsSync(targetPath)) {
                        fs.copyFileSync(sourcePath, targetPath);
                    }
                    
                    // 4. Update Database
                    await connection.execute(
                        `UPDATE album SET image = ? WHERE id = ?`,
                        [image_filename, album_id]
                    );

                    console.log(`[OK] Album ID ${album_id}: Cover updated -> ${image_filename}`);
                } catch (err) {
                    console.error(`[ERR] Gagal copy file untuk Album ${album_id}:`, err);
                }

            } else {
                console.warn(`[SKIP] File foto tidak ditemukan: ${image_filename}`);
            }
        }

        console.log('🎉 Selesai!');

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    } finally {
        if (connection) connection.release();
        process.exit(); // Matikan script setelah selesai
    }
};

generateCovers();