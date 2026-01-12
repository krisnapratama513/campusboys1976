// server/src/controllers/user.controller.ts

/**
 * ==============================================================================
 * USER CONTROLLER
 * ==============================================================================
 * Menangani request HTTP untuk modul User.
 */

import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import fs from 'fs';
import path from 'path';

// Direktori Uploads (Server Storage)
const uploadDir = path.join(__dirname, '../../uploads/profiles');

// Helper: Cek Kekuatan Password
const isPasswordStrong = (password: string): boolean => {
    // Minimal 8 char, ada huruf besar & angka
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= minLength && hasUpperCase && hasNumber;
};

/**
 * GET All Members
 */
export const getMembers = async (req: Request, res: Response) => {
    try {
        const data = await userService.getAllMembers();
        res.json({ message: 'Berhasil memuat data member', data });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET Detail Member by ID
 */
export const getMemberDetail = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID Member tidak valid' });

        const data = await userService.getMemberById(id);
        if (!data) return res.status(404).json({ message: 'Member tidak ditemukan' });

        res.json({ data });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ADMIN: Update Role/Access
 */
export const updateMemberByAdmin = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { role, chapter_id, generation } = req.body;

        await userService.updateMemberAccess(id, { role, chapter_id, generation });
        res.json({ message: 'Akses member berhasil diperbarui.' });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ADMIN: Create New Member
 */
export const createMember = async (req: Request, res: Response) => {
    try {
        const { username, password, role, chapter_id, generation } = req.body;

        if (!username || !password || !role || !chapter_id || !generation) {
            return res.status(400).json({ message: 'Data tidak lengkap.' });
        }

        if (!isPasswordStrong(password)) {
            return res.status(400).json({ 
                message: 'Password terlalu lemah! Minimal 8 karakter, mengandung 1 huruf besar dan 1 angka.' 
            });
        }

        await userService.createMember({
            username,
            password,
            role,
            chapter_id,
            generation: Number(generation)
        });

        res.status(201).json({ message: 'Member berhasil ditambahkan' });

    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username sudah digunakan.' });
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * USER: Update Profile (Bio, Photo, etc)
 */
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id); 
        const { full_name, bio, phone } = req.body;
        
        let image = undefined;
        if (req.file) {
            image = req.file.filename;

            // [CLEANUP] Hapus foto lama jika user upload baru
            // (Perlu query ambil nama file lama dulu, ini logic tambahan opsional tapi bagus)
            const oldData = await userService.getMemberById(userId);
            if (oldData && oldData.image && oldData.image !== 'default_user.png') {
                const oldPath = path.join(uploadDir, oldData.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        await userService.updateMemberProfile(userId, { full_name, bio, phone, image });
        res.json({ message: 'Profil berhasil diperbarui' });

    } catch (error: any) {
        // Hapus file baru yang terlanjur diupload jika database error
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
    }
};

/**
 * USER: Change Username
 */
export const changeUsername = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { username } = req.body;

        if (!username || username.trim() === '') {
            return res.status(400).json({ message: 'Username tidak boleh kosong.' });
        }

        if (/\s/.test(username)) {
             return res.status(400).json({ message: 'Username tidak boleh mengandung spasi.' });
        }

        await userService.updateUsername(id, username);
        res.json({ message: 'Username berhasil diganti!' });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * USER: Change Password
 */
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Konfirmasi password tidak cocok.' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password baru minimal 8 karakter.' });
        }

        await userService.changePassword(id, { oldPassword, newPassword });
        res.json({ message: 'Password berhasil diperbarui! Silakan login ulang.' });

    } catch (error: any) {
        if (error.message === 'Password lama salah!') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * ADMIN: Delete Member
 */
export const deleteMember = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        // [CLEANUP] Hapus foto profil fisik sebelum hapus DB
        const member = await userService.getMemberById(id);
        if (member && member.image && member.image !== 'default_user.png') {
            const imgPath = path.join(uploadDir, member.image);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
        
        await userService.deleteMember(id);
        res.json({ message: 'Member berhasil dihapus' });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};