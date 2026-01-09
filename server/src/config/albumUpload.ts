import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Siapkan folder
const coverDir = path.join(__dirname, '../../../client/public/albums/covers');
const galleryDir = path.join(__dirname, '../../../client/public/albums/gallery');

// Buat folder jika belum ada
if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir, { recursive: true });
if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pisahkan lokasi simpan berdasarkan field name formnya
        if (file.fieldname === 'cover') {
            cb(null, coverDir);
        } else if (file.fieldname === 'photos') {
            cb(null, galleryDir);
        } else {
            cb(new Error('Field file tidak dikenal'), '');
        }
    },
    filename: (req, file, cb) => {
        // Format: timestamp-random.ext
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
    cb(null, true);
};

export const uploadAlbum = multer({ storage, fileFilter });