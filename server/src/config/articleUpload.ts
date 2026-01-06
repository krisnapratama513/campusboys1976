import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Folder penyimpanan sementara (Temp)
// Nanti controller yang akan memindahkan ke public/article
const tempDir = path.join(__dirname, '../../../client/public/temp_article');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `temp-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Hanya file gambar (jpg, jpeg, png, webp)!'), false);
    }
    cb(null, true);
};

export const uploadArticle = multer({ storage, fileFilter });