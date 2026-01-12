/**
 * ==============================================================================
 * FANZINE CONTROLLER
 * ==============================================================================
 * Menangani upload PDF & Cover, serta manajemen data Fanzine.
 */

import { Request, Response } from 'express';
import * as fanzineService from '../services/fanzine.service';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';

// --- CONFIG STORAGE ---
// Kita simpan di folder server/uploads agar konsisten dengan Article & User
const baseUploadDir = path.join(__dirname, '../../uploads/fanzines');
const pdfDir = baseUploadDir; 
const coverDir = path.join(baseUploadDir, 'covers');

// Pastikan folder ada
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir, { recursive: true });


// --- PUBLIC: GET LIST ---
export const getAllFanzines = async (req: Request, res: Response) => {
    try {
        const fanzines = await fanzineService.getAllFanzines();
        res.json({ message: 'Berhasil ambil data fanzines', data: fanzines });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
};

// --- PUBLIC: GET DETAIL BY SLUG ---
export const getFanzineBySlug = async (req: Request, res: Response) => {
    try {
        const slug = String(req.params.slug);
        const fanzine = await fanzineService.getFanzineBySlug(slug);
        if (!fanzine) {
            return res.status(404).json({ message: 'Fanzine tidak ditemukan' });
        }
        res.json({ data: fanzine });
    } catch (error: any) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}

// --- ADMIN: GET BY ID ---
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

// --- ADMIN: CREATE ---
export const createFanzine = async (req: Request, res: Response) => {
    try {
        const { title, date, author_id } = req.body;
        
        if (!title || !author_id) {
            return res.status(400).json({ message: 'Title dan Author wajib diisi' });
        }

        // 1. Insert DB (Dapat ID untuk penamaan file)
        const newId = await fanzineService.createFanzineInitial({
            title,
            date: date || new Date(),
            author_id
        });

        // 2. Siapkan Slug & Nama File
        const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
        const finalSlug = `${newId}_${cleanTitle}`; 

        // 3. Proses File Upload
        // Multer menyimpan file di folder temp (sesuai config router), kita pindahkan ke folder final
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        let finalImgName = null;
        let finalPdfName = null;

        // Proses Cover
        if (files?.['cover']?.[0]) {
            const tempFile = files['cover'][0];
            const ext = path.extname(tempFile.originalname);
            finalImgName = `${finalSlug}_cover${ext}`; // ex: 10_edisi_mei_cover.jpg
            
            fs.renameSync(tempFile.path, path.join(coverDir, finalImgName));
        }

        // Proses PDF
        if (files?.['pdf']?.[0]) {
            const tempFile = files['pdf'][0];
            const ext = path.extname(tempFile.originalname);
            finalPdfName = `${finalSlug}${ext}`; // ex: 10_edisi_mei.pdf
            
            fs.renameSync(tempFile.path, path.join(pdfDir, finalPdfName));
        }

        // 4. Update DB dengan nama file final
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
        // Hapus file temp jika error (Cleanup)
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files?.['cover']?.[0]) fs.unlinkSync(files['cover'][0].path);
        if (files?.['pdf']?.[0]) fs.unlinkSync(files['pdf'][0].path);

        console.error(error);
        res.status(500).json({ message: 'Gagal membuat fanzine', error: error.message });
    }
};

// --- ADMIN: UPDATE ---
export const updateFanzine = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, date, author_id } = req.body;
        
        const oldData = await fanzineService.getFanzineById(id);
        if (!oldData) return res.status(404).json({ message: 'Fanzine tidak ditemukan' });

        // Logic Slug Baru (Jika title berubah)
        let newSlug = oldData.slug;
        if (title && title !== oldData.title) {
            const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
            newSlug = `${id}_${cleanTitle}`;
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        let finalImgName = oldData.imgFilename;
        let finalPdfName = oldData.pdfFilename;

        // Proses Cover Baru
        if (files?.['cover']?.[0]) {
            // Hapus file lama
            if (oldData.imgFilename) {
                const oldPath = path.join(coverDir, oldData.imgFilename);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            // Simpan file baru
            const tempFile = files['cover'][0];
            const ext = path.extname(tempFile.originalname);
            finalImgName = `${newSlug}_cover${ext}`;
            fs.renameSync(tempFile.path, path.join(coverDir, finalImgName));
        }

        // Proses PDF Baru
        if (files?.['pdf']?.[0]) {
            // Hapus file lama
            if (oldData.pdfFilename) {
                const oldPath = path.join(pdfDir, oldData.pdfFilename);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            // Simpan file baru
            const tempFile = files['pdf'][0];
            const ext = path.extname(tempFile.originalname);
            finalPdfName = `${newSlug}${ext}`;
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

// --- ADMIN: DELETE ---
export const deleteFanzine = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const oldData = await fanzineService.getFanzineById(id);
        
        if (!oldData) return res.status(404).json({ message: 'Fanzine tidak ditemukan' });

        // Hapus Cover
        if (oldData.imgFilename) {
            const coverPath = path.join(coverDir, oldData.imgFilename);
            if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
        }

        // Hapus PDF
        if (oldData.pdfFilename) {
            const pdfPath = path.join(pdfDir, oldData.pdfFilename);
            if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        }

        await fanzineService.deleteFanzine(id);

        res.json({ message: 'Fanzine dan file berhasil dihapus' });

    } catch (error: any) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: 'Gagal menghapus data', error: error.message });
    }
};