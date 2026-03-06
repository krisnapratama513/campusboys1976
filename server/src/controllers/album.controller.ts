/**
 * ==============================================================================
 * ALBUM CONTROLLER
 * ==============================================================================
 * Menangani request HTTP untuk Album & Photo.
 * Mengelola upload file, rename file, dan hapus file fisik.
 */

import { Request, Response } from 'express';
import * as albumService from '../services/album.service';
import { fetchAllPublishedAlbums, fetchPublicAlbumDetail } from '../services/album.service';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';

// [PATH]  server/uploads agar konsisten dengan config multer
const baseDir = path.join(__dirname, '../../uploads/albums');
const coverDir = path.join(baseDir, 'covers');
const galleryDir = path.join(baseDir, 'gallery');

/**
 * Helper: Menghapus file fisik secara aman.
 * Mengecek keberadaan file sebelum unlink untuk mencegah error.
 */
const deleteFile = (filePath: string) => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

// ==========================================
// PUBLIC CONTROLLERS
// ==========================================

/**
 * GET Public Albums
 * Mengambil daftar album yang sudah publish (untuk pengunjung).
 */
export const getPublicAlbums = async (req: Request, res: Response) => {
    try {
        // Tangkap query ?page= dari URL, default ke 1 jika kosong
        const page = parseInt(req.query.page as string) || 1;
        const limit = 9; // Sesuai kebutuhan frontend
        const offset = (page - 1) * limit;

        // Panggil service
        const { albums, totalItems } = await albumService.fetchAllPublishedAlbums(limit, offset);
        
        // Hitung total halaman
        const totalPages = Math.ceil(totalItems / limit);

        // Kirim response
        res.json({ 
            message: 'Success', 
            data: albums,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems,
                limit: limit
            }
        }); 
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET Public Detail
 * Mengambil detail album + foto gallery berdasarkan SLUG atau ID.
 */
export const getPublicAlbumDetail = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        
        if (!slug) {
            return res.status(400).json({ message: 'Slug album tidak ditemukan' });
        }

        const data = await fetchPublicAlbumDetail(slug);
        
        if (!data) return res.status(404).json({ message: 'Album tidak ditemukan' });
        
        res.json({ data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// ==========================================
// ADMIN CONTROLLERS
// ==========================================

/**
 * ADMIN: Get All Albums
 * Mengambil semua album termasuk status draft/pending.
 */
export const getAdminAlbums = async (req: Request, res: Response) => {
    try {
        const data = await albumService.getAllAlbums();
        res.json({ data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * ADMIN: Get Album By ID
 * Mengambil detail album untuk keperluan form edit admin.
 */
export const getAlbumById = async (req: Request, res: Response) => {
    try {
        const data = await albumService.getAlbumById(Number(req.params.id));
        if (!data) return res.status(404).json({ message: 'Album tidak ditemukan' });
        res.json({ data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * ADMIN: Create Album
 * 1. Validasi Cover -> 2. Insert DB Awal -> 3. Rename File (Slug) -> 4. Update DB -> 5. Insert Photos
 */
export const createAlbum = async (req: Request, res: Response) => {
    try {
        const { title, description, date, status } = req.body;
        
        // Casting req.files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        // Validasi: Cover Wajib
        if (!files || !files.cover || files.cover.length === 0) {
            return res.status(400).json({ message: 'Cover album wajib diupload!' });
        }

        const coverFile = files.cover[0]!; 
        const galleryFiles = files.photos || [];

        // 1. Insert DB Awal (nama & image sementara)
        const newId = await albumService.createAlbumInitial({
            title, 
            name: 'temp', 
            description, 
            image: 'temp.jpg',
            date: date || new Date(), 
            status: status || 'pending'
        });

        // 2. Generate Slug & Rename Cover
        // Format Slug: ID_judul-album
        const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
        const slug = `${newId}_${cleanTitle}`;
        
        const coverExt = path.extname(coverFile.originalname);
        const finalCoverName = `${slug}${coverExt}`;
        
        // Rename fisik file
        fs.renameSync(coverFile.path, path.join(coverDir, finalCoverName));

        // 3. Update DB dengan info final
        await albumService.updateAlbumInfo(newId, { name: slug, image: finalCoverName });

        // 4. Proses Gallery Photos
        if (galleryFiles.length > 0) {
            const photoFilenames = galleryFiles.map(f => f.filename);
            await albumService.addAlbumPhotos(newId, photoFilenames);
        }

        res.status(201).json({ message: 'Album berhasil dibuat', data: { id: newId } });

    } catch (err: any) {
        // [Optional] Bisa tambahkan cleanup file temp disini jika error
        res.status(500).json({ message: 'Gagal membuat album', error: err.message });
    }
};

/**
 * ADMIN: Update Album
 * Menangani perubahan info, cover replacement, dan penambahan foto baru.
 */
export const updateAlbum = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, description, date, status } = req.body;
        
        // 1. Cek Data Lama
        const oldData = await albumService.getAlbumById(id);
        if (!oldData) return res.status(404).json({ message: 'Album tidak ditemukan' });

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const newCoverFile = files?.cover ? files.cover[0] : null;
        const newGalleryFiles = files?.photos || [];

        // 2. Logic Slug Baru (Jika title berubah)
        let newSlug = oldData.name;
        if (title && title !== oldData.title) {
            const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
            newSlug = `${id}_${cleanTitle}`;
        }

        // 3. Handle Cover File
        let finalCoverName: string | undefined = undefined; 

        // CASE A: User upload cover baru
        if (newCoverFile) {
            // Hapus cover lama
            if (oldData.image) deleteFile(path.join(coverDir, oldData.image));
            
            // Simpan cover baru
            const ext = path.extname(newCoverFile.originalname);
            finalCoverName = `${newSlug}${ext}`;
            fs.renameSync(newCoverFile.path, path.join(coverDir, finalCoverName));
        } 
        // CASE B: User TIDAK upload cover, tapi judul berubah (Slug berubah -> Rename file lama)
        else if (newSlug !== oldData.name && oldData.image) {
            const ext = path.extname(oldData.image);
            const newName = `${newSlug}${ext}`;
            const oldPath = path.join(coverDir, oldData.image);
            
            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, path.join(coverDir, newName));
                finalCoverName = newName;
            }
        }

        // 4. Update DB
        // Gunakan spread syntax untuk update conditional image
        await albumService.updateAlbumInfo(id, {
            title, 
            description, 
            date, 
            status,
            name: newSlug,
            ...(finalCoverName && { image: finalCoverName }) 
        });

        // 5. Tambah Foto Gallery Baru (Append)
        if (newGalleryFiles.length > 0) {
            const photoFilenames = newGalleryFiles.map(f => f.filename);
            await albumService.addAlbumPhotos(id, photoFilenames);
        }

        res.json({ message: 'Album berhasil diupdate' });

    } catch (err: any) {
        res.status(500).json({ message: 'Gagal update album', error: err.message });
    }
};

/**
 * ADMIN: Delete Album
 * Menghapus data album di DB, data foto di DB, serta semua file fisik terkait.
 */
export const deleteAlbum = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        // 1. Ambil data dulu (untuk nama file cover)
        const albumData = await albumService.getAlbumById(id);
        if(!albumData) return res.status(404).json({message: 'Album tidak ditemukan'});

        // 2. Hapus DB & Dapat list foto yang terhapus (untuk nama file gallery)
        const photosToDelete = await albumService.deleteAlbum(id) as any[];
        
        // 3. Hapus Fisik Foto Gallery
        if (photosToDelete && photosToDelete.length > 0) {
            photosToDelete.forEach(photo => {
                deleteFile(path.join(galleryDir, photo.image_filename));
            });
        }

        // 4. Hapus Fisik Cover
        if (albumData.image) {
            deleteFile(path.join(coverDir, albumData.image));
        }
        
        res.json({ message: 'Album dan foto berhasil dihapus' });
    } catch (err: any) {
        res.status(500).json({ message: 'Gagal hapus album', error: err.message });
    }
};

/**
 * ADMIN: Delete Single Photo
 * Menghapus satu foto dari dalam album (biasanya dipanggil dari halaman Edit Album).
 */
export const deletePhoto = async (req: Request, res: Response) => {
    try {
        const photoId = Number(req.params.photoId);
        
        // Service menghapus di DB dan me-return data foto yang dihapus
        const deletedPhoto = await albumService.deletePhotoById(photoId);
        
        if (deletedPhoto) {
            // Hapus file fisik
            deleteFile(path.join(galleryDir, deletedPhoto.image_filename));
            res.json({ message: 'Foto berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'Foto tidak ditemukan' });
        }
    } catch (err: any) {
        res.status(500).json({ message: 'Gagal hapus foto', error: err.message });
    }
};