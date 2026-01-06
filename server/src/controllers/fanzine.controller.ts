import { Request, Response } from 'express';
import * as fanzineService from '../services/fanzine.service';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';

// --- DEFINISI FOLDER (Agar rapi dan konsisten) ---
// PDF disimpan di folder 'magazine'
const pdfDir = path.join(__dirname, '../../../client/public/magazine');
// Cover disimpan di folder 'magazine/cover'
const coverDir = path.join(__dirname, '../../../client/public/magazine/cover');

// Pastikan folder cover ada (jaga-jaga)
if (!fs.existsSync(coverDir)) {
    fs.mkdirSync(coverDir, { recursive: true });
}

// ==========================================
// 1. GET BY ID
// ==========================================
export const getFanzineById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const fanzine = await fanzineService.getFanzineById(id);
        
        if (!fanzine) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.json({ data: fanzine });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// ==========================================
// 2. CREATE FANZINE (Fix Path Cover)
// ==========================================
export const createFanzine = async (req: Request, res: Response) => {
    try {
        const { title, date, author_id } = req.body;
        
        if (!title || !author_id) {
            return res.status(400).json({ message: 'Title dan Author wajib diisi' });
        }

        // A. Insert DB (Dapat ID)
        const newId = await fanzineService.createFanzineInitial({
            title,
            date: date || new Date(),
            author_id
        });

        // B. Siapkan Nama
        const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
        const baseName = `${newId}_${cleanTitle}`; 
        const finalSlug = baseName; 

        // C. Proses File
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        let finalImgName = null;
        let finalPdfName = null;

        // --- PROSES COVER (Pindah ke folder COVER) ---
        if (files?.['cover']?.[0]) {
            const tempFile = files['cover'][0]; // File ada di pdfDir (karena multer config)
            const ext = path.extname(tempFile.originalname);
            finalImgName = `${baseName}${ext}`; 
            
            // Pindahkan dari temp (magazine/) ke final (magazine/cover/)
            fs.renameSync(tempFile.path, path.join(coverDir, finalImgName));
        }

        // --- PROSES PDF (Tetap di folder MAGAZINE) ---
        if (files?.['pdf']?.[0]) {
            const tempFile = files['pdf'][0];
            const ext = path.extname(tempFile.originalname);
            finalPdfName = `${baseName}${ext}`;

            // Rename di folder yang sama
            fs.renameSync(tempFile.path, path.join(pdfDir, finalPdfName));
        }

        // D. Update DB
        await fanzineService.updateFanzineFiles(newId, {
            slug: finalSlug,
            imgFilename: finalImgName,
            pdfFilename: finalPdfName
        });

        res.status(201).json({ 
            message: 'Fanzine berhasil dibuat',
            data: { id: newId, slug: finalSlug }
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat fanzine', error: error.message });
    }
};

// ==========================================
// 3. UPDATE FANZINE (Fix Path & Delete Old File)
// ==========================================
export const updateFanzine = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, date, author_id } = req.body;
        
        const oldData = await fanzineService.getFanzineById(id);
        if (!oldData) return res.status(404).json({ message: 'Fanzine tidak ditemukan' });

        // Logic Slug
        let newSlug = oldData.slug;
        if (title && title !== oldData.title) {
            const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
            newSlug = `${id}_${cleanTitle}`;
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        let finalImgName = oldData.imgFilename;
        let finalPdfName = oldData.pdfFilename;

        // --- CEK COVER BARU ---
        if (files?.['cover']?.[0]) {
            // 1. Hapus Cover Lama (Cek di coverDir)
            if (oldData.imgFilename) {
                const oldPath = path.join(coverDir, oldData.imgFilename);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            // 2. Simpan Cover Baru
            const tempFile = files['cover'][0];
            const ext = path.extname(tempFile.originalname);
            finalImgName = `${newSlug}${ext}`;
            
            // Pindah ke coverDir
            fs.renameSync(tempFile.path, path.join(coverDir, finalImgName));
        }

        // --- CEK PDF BARU ---
        if (files?.['pdf']?.[0]) {
            // 1. Hapus PDF Lama (Cek di pdfDir)
            if (oldData.pdfFilename) {
                const oldPath = path.join(pdfDir, oldData.pdfFilename);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            // 2. Simpan PDF Baru
            const tempFile = files['pdf'][0];
            const ext = path.extname(tempFile.originalname);
            finalPdfName = `${newSlug}${ext}`;
            
            // Rename di pdfDir
            fs.renameSync(tempFile.path, path.join(pdfDir, finalPdfName));
        }

        // Update DB
        await fanzineService.updateFanzineFiles(id, {
            slug: newSlug,
            imgFilename: finalImgName,
            pdfFilename: finalPdfName
        });
        
        await fanzineService.updateFanzineInfo(id, { title, date, author_id });

        res.json({ message: 'Fanzine berhasil diupdate' });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Gagal update', error: error.message });
    }
};

// ==========================================
// 4. DELETE FANZINE (Hapus File Fisik + DB)
// ==========================================
export const deleteFanzine = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        // 1. Ambil Data Dulu (Untuk tahu nama filenya)
        const oldData = await fanzineService.getFanzineById(id);
        
        if (!oldData) {
            return res.status(404).json({ message: 'Fanzine tidak ditemukan' });
        }

        // 2. Hapus File COVER (jika ada)
        if (oldData.imgFilename) {
            const coverPath = path.join(coverDir, oldData.imgFilename);
            if (fs.existsSync(coverPath)) {
                fs.unlinkSync(coverPath); // Hapus fisik
            }
        }

        // 3. Hapus File PDF (jika ada)
        if (oldData.pdfFilename) {
            const pdfPath = path.join(pdfDir, oldData.pdfFilename);
            if (fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath); // Hapus fisik
            }
        }

        // 4. Hapus Data di Database
        await fanzineService.deleteFanzine(id);

        res.json({ message: 'Fanzine dan file berhasil dihapus' });

    } catch (error: any) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: 'Gagal menghapus data', error: error.message });
    }
};

// ... function lainnya (getAll, getBySlug) tetap sama ...
export const getAllFanzines = async (req: Request, res: Response) => {
    try {
        const fanzines = await fanzineService.getAllFanzines();
        res.json({
            message: 'Berhasil ambil data fanzines',
            data: fanzines
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
};

export const getFanzineBySlug = async (req: Request, res: Response) => {
    try {
        const slug = String(req.params.slug);
        const fanzine = await fanzineService.getFanzineBySlug(slug);
        if (!fanzine) {
            return res.status(404).json({ message: 'Fanzine tidak ditemukan' });
        }
        res.json({ message: 'Detail fanzine ditemukan', data: fanzine });
    } catch (error) {
        res.status(500).json({message: "Gagal mengambil detail fanzine"})
    }
}