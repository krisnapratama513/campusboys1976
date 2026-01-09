import { Router } from "express";
import { uploadAlbum } from "../config/albumUpload";
import { 
    getAdminAlbums, 
    getAlbumById, 
    createAlbum, 
    updateAlbum, 
    deleteAlbum,
    deletePhoto,
    // Import controller baru
    getPublicAlbums, 
    getPublicAlbumDetail 
} from "../controllers/album.controller";

const router = Router();

// Konfigurasi Upload:
// - Field 'cover': max 1 file
// - Field 'photos': max 10 file (bisa diubah)
const uploadFields = uploadAlbum.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'photos', maxCount: 10 }
]);

// --- ROUTE PUBLIC (Ditaruh ATAS agar tidak tertimpa :id) ---
router.get('/public', getPublicAlbums);           // GET /api/albums/public
router.get('/public/:slug', getPublicAlbumDetail); // GET /api/albums/public/slug-album

// --- ROUTE ADMIN ---
// Read
router.get('/', getAdminAlbums);
router.get('/:id', getAlbumById);

// Create
router.post('/', uploadFields, createAlbum);

// Update (Edit Info + Ganti Cover + Tambah Foto)
router.put('/:id', uploadFields, updateAlbum);

// Delete Album (Satu Album full)
router.delete('/:id', deleteAlbum);

// Delete Single Photo (Hapus 1 foto dari gallery)
router.delete('/photo/:photoId', deletePhoto);

export default router;