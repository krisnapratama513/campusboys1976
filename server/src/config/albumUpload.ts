/**
 * ==============================================================================
 * ALBUM UPLOAD CONFIGURATION
 * ==============================================================================
 * Konfigurasi Multer untuk menangani upload file Album.
 * - Cover disimpan di: server/uploads/albums/covers
 * - Foto Gallery disimpan di: server/uploads/albums/gallery
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// [UPDATE] Path penyimpanan di server/uploads (bukan client/public)
const baseDir = path.join(__dirname, '../../uploads/albums');
const coverDir = path.join(baseDir, 'covers');
const galleryDir = path.join(baseDir, 'gallery');

// Pastikan direktori tersedia
if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir, { recursive: true });
if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pisahkan folder berdasarkan field name ('cover' atau 'photos')
        if (file.fieldname === 'cover') {
            cb(null, coverDir);
        } else if (file.fieldname === 'photos') {
            cb(null, galleryDir);
        } else {
            cb(new Error('Field file tidak dikenal'), '');
        }
    },
    filename: (req, file, cb) => {
        // Format: timestamp-random.ext (Agar nama file unik)
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    // Validasi tipe file (Hanya Gambar)
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
    cb(null, true);
};

export const uploadAlbum = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit Max 5MB per file
});