// server/src/config/upload.ts

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Arahkan ke folder public di client
const uploadPath = path.join(__dirname, '../../../client/public/magazine');

// Pastikan folder ada
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // SIMPAN SEMENTARA: temp-[timestamp].ext
        // Kita belum punya ID disini, jadi pakai nama acak dulu
        const uniqueSuffix = `temp-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (file.fieldname === 'cover') {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
            return cb(new Error('Hanya file gambar (jpg, jpeg, png)!'), false);
        }
    } else if (file.fieldname === 'pdf') {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Hanya file PDF!'), false);
        }
    }
    cb(null, true);
};

export const uploaddadad = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Batas 10MB
});