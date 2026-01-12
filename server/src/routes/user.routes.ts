/**
 * ==============================================================================
 * USER ROUTES
 * ==============================================================================
 * Endpoint manajemen User.
 * Menggunakan Multer untuk upload foto profil ke 'server/uploads/profiles'.
 */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as userController from '../controllers/user.controller';

// Middleware Auth
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { PERMISSIONS } from '../config/permissions';

const router = Router();

// --- CONFIG UPLOAD (MULTER) ---
const uploadDir = path.join(__dirname, '../../uploads/profiles'); // Server Storage

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan!'));
        }
    }
});


// --- PUBLIC ROUTES ---
// Direktori member bisa dilihat publik (Read Only)
router.get('/', userController.getMembers);
router.get('/:id', userController.getMemberDetail);


// --- PROTECTED ROUTES (USER SELF SERVICE) ---
// User bisa edit profil sendiri (harus punya Token)
// Note: Idealnya check ID di controller harus match dengan ID di token
router.put(
    '/:id/profile', 
    authenticateToken, 
    upload.single('image'), 
    userController.updateProfile
);
router.put('/:id/username', authenticateToken, userController.changeUsername);
router.put('/:id/password', authenticateToken, userController.updatePassword);


// --- PROTECTED ROUTES (SUPERADMIN ONLY) ---
// Hanya Superadmin yang boleh Create/Delete user dan ganti Role
router.post(
    '/', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_USERS), 
    userController.createMember
);

router.delete(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_USERS), 
    userController.deleteMember
);

router.put(
    '/:id', 
    authenticateToken, 
    requireRole(PERMISSIONS.CAN_MANAGE_USERS), 
    userController.updateMemberByAdmin
);

export default router;