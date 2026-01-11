import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
    getMembers, 
    createMember, 
    deleteMember, 
    updateProfile ,
    getMemberDetail,
    updateMemberByAdmin,
    changeUsername,
    updatePassword
} from '../controllers/user.controller';

const router = Router();

// --- CONFIG UPLOAD FOTO PROFIL ---
// Simpan di folder client/public/uploads/profiles
const uploadDir = path.join(__dirname, '../../../client/public/uploads/profiles');

// Cek folder, buat jika belum ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Format: profile-{timestamp}-{random}.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


// --- DEFINISI ROUTE ---

// 1. GET List Member (Public/Member)
router.get('/', getMembers);

// 2. GET Detail Lengkap (INI YANG KURANG)
// Route ini menangkap request /api/users/5, /api/users/12, dst.
router.get('/:id', getMemberDetail);

// 2. CREATE Member (Superadmin)
// Tidak perlu upload foto, karena foto default diset by system
router.post('/', createMember);

router.put('/:id/username', changeUsername);
router.put('/:id/password', updatePassword);

// 3. DELETE Member (Superadmin)
router.delete('/:id', deleteMember);


// UPDATE DATA SENSITIF (Superadmin Only)
// Note: URL-nya kita buat beda sedikit atau pakai method PUT di root id
router.put('/:id', updateMemberByAdmin);

// 4. UPDATE Profile (Member)
// Menerima upload single file dengan key 'image'
router.put('/:id/profile', upload.single('image'), updateProfile);

export default router;