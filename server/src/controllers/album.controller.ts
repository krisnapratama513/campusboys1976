import { Request, Response } from 'express';
import * as albumService from '../services/album.service';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';

// Direktori penyimpanan
const coverDir = path.join(__dirname, '../../../client/public/albums/covers');
const galleryDir = path.join(__dirname, '../../../client/public/albums/gallery');

// Helper: Hapus file aman
const deleteFile = (filePath: string) => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};


// Tambahkan import service public fetcher
import { fetchAllPublishedAlbums, fetchPublicAlbumDetail } from '../services/album.service';

// --- PUBLIC CONTROLLERS ---

export const getPublicAlbums = async (req: Request, res: Response) => {
    try {
        // Service ini return Array murni, bukan object { data }
        const data = await fetchAllPublishedAlbums(); 
        res.json(data); 
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getPublicAlbumDetail = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        
        // --- PERBAIKAN DI SINI ---
        if (!slug) {
            return res.status(400).json({ message: 'Slug album tidak ditemukan' });
        }
        // -------------------------

        // Sekarang TypeScript tahu 'slug' adalah string
        const data = await fetchPublicAlbumDetail(slug);
        
        if (!data) return res.status(404).json({ message: 'Album tidak ditemukan' });
        
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// --- ADMIN READ ---

export const getAdminAlbums = async (req: Request, res: Response) => {
    try {
        const data = await albumService.getAllAlbums();
        res.json({ data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getAlbumById = async (req: Request, res: Response) => {
    try {
        const data = await albumService.getAlbumById(Number(req.params.id));
        if (!data) return res.status(404).json({ message: 'Album tidak ditemukan' });
        res.json({ data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// --- CREATE ---

export const createAlbum = async (req: Request, res: Response) => {
    try {
        const { title, description, date, status } = req.body;
        
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        // 1. Validasi Cover
        if (!files || !files.cover || files.cover.length === 0) {
            return res.status(400).json({ message: 'Cover album wajib diupload!' });
        }

        // FIX 1: Gunakan Non-null assertion (!) karena kita sudah cek length diatas
        const coverFile = files.cover[0]!; 
        const galleryFiles = files.photos || [];

        // 2. Insert DB Awal
        const newId = await albumService.createAlbumInitial({
            title, 
            name: 'temp', 
            description, 
            image: 'temp.jpg',
            date: date || new Date(), 
            status: status || 'pending'
        });

        // 3. Generate Slug & Rename Cover
        const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
        const slug = `${newId}_${cleanTitle}`;
        
        const coverExt = path.extname(coverFile.originalname);
        const finalCoverName = `${slug}${coverExt}`;
        
        fs.renameSync(coverFile.path, path.join(coverDir, finalCoverName));

        // 4. Update DB
        await albumService.updateAlbumInfo(newId, { name: slug, image: finalCoverName });

        // 5. Handle Gallery Photos
        if (galleryFiles.length > 0) {
            const photoFilenames = galleryFiles.map(f => f.filename);
            await albumService.addAlbumPhotos(newId, photoFilenames);
        }

        res.status(201).json({ message: 'Album berhasil dibuat', data: { id: newId } });

    } catch (err: any) {
        res.status(500).json({ message: 'Gagal membuat album', error: err.message });
    }
};

// --- UPDATE ---

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

        // 2. Slug Logic
        let newSlug = oldData.name;
        if (title && title !== oldData.title) {
            const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
            newSlug = `${id}_${cleanTitle}`;
        }

        // 3. Handle Cover Update
        let finalCoverName: string | undefined = undefined; 

        // A. Upload baru
        if (newCoverFile) {
            if (oldData.image) deleteFile(path.join(coverDir, oldData.image));
            
            const ext = path.extname(newCoverFile.originalname);
            finalCoverName = `${newSlug}${ext}`;
            fs.renameSync(newCoverFile.path, path.join(coverDir, finalCoverName));
        } 
        // B. Rename file lama jika slug berubah
        else if (newSlug !== oldData.name && oldData.image) {
            const ext = path.extname(oldData.image);
            const newName = `${newSlug}${ext}`;
            const oldPath = path.join(coverDir, oldData.image);
            
            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, path.join(coverDir, newName));
                finalCoverName = newName;
            }
        }

        // 4. Update Info Album
        // FIX 2: Gunakan Conditional Spread agar tidak mengirim properti image jika undefined
        await albumService.updateAlbumInfo(id, {
            title, 
            description, 
            date, 
            status,
            name: newSlug,
            ...(finalCoverName && { image: finalCoverName }) 
        });

        // 5. Tambah Foto Gallery Baru
        if (newGalleryFiles.length > 0) {
            const photoFilenames = newGalleryFiles.map(f => f.filename);
            await albumService.addAlbumPhotos(id, photoFilenames);
        }

        res.json({ message: 'Album berhasil diupdate' });

    } catch (err: any) {
        res.status(500).json({ message: 'Gagal update album', error: err.message });
    }
};

// --- DELETE ALBUM ---

export const deleteAlbum = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        // 1. Ambil data album dulu sebelum dihapus (agar tahu nama cover)
        const albumData = await albumService.getAlbumById(id);
        if(!albumData) return res.status(404).json({message: 'Album tidak ditemukan'});

        // 2. Hapus Album & Foto dari Database (Service return list foto gallery)
        const photosToDelete = await albumService.deleteAlbum(id) as any[];
        
        // 3. Hapus File Foto Gallery
        if (photosToDelete && photosToDelete.length > 0) {
            photosToDelete.forEach(photo => {
                deleteFile(path.join(galleryDir, photo.image_filename));
            });
        }

        // 4. Hapus File Cover
        if (albumData.image) {
            deleteFile(path.join(coverDir, albumData.image));
        }
        
        res.json({ message: 'Album dan foto berhasil dihapus' });
    } catch (err: any) {
        res.status(500).json({ message: 'Gagal hapus album', error: err.message });
    }
};

// --- DELETE SINGLE PHOTO ---

export const deletePhoto = async (req: Request, res: Response) => {
    try {
        const photoId = Number(req.params.photoId);
        
        const deletedPhoto = await albumService.deletePhotoById(photoId);
        
        if (deletedPhoto) {
            deleteFile(path.join(galleryDir, deletedPhoto.image_filename));
            res.json({ message: 'Foto berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'Foto tidak ditemukan' });
        }
    } catch (err: any) {
        res.status(500).json({ message: 'Gagal hapus foto', error: err.message });
    }
};