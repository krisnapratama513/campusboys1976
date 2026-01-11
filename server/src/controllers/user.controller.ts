import { Request, Response } from 'express';
import * as userService from '../services/user.service';


// Helper: Cek Kekuatan Password
const isPasswordStrong = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasNumber;
};

// 1. GET ALL MEMBERS (Directory List)
export const getMembers = async (req: Request, res: Response) => {
    try {
        const data = await userService.getAllMembers();
        res.json({ 
            message: 'Berhasil memuat data member',
            data 
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMemberDetail = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        // Validasi: ID harus angka
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID Member tidak valid' });
        }

        // Panggil Service yang sudah Anda buat
        const data = await userService.getMemberById(id);
        
        // Cek jika member tidak ditemukan
        if (!data) {
            return res.status(404).json({ message: 'Member tidak ditemukan di database' });
        }

        res.json({ data }); // Kirim data ke frontend
    } catch (error: any) {
        console.error("Get Detail Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ADMIN UPDATE MEMBER
export const updateMemberByAdmin = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { role, chapter_id, generation } = req.body;

        if (!role || !chapter_id || !generation) {
            return res.status(400).json({ message: 'Data Role, Chapter, dan Generasi wajib diisi.' });
        }

        await userService.updateMemberAccess(id, {
            role,
            chapter_id,
            generation
        });

        res.json({ message: 'Data member berhasil diperbarui.' });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// 2. CREATE MEMBER (Superadmin Only)
// CREATE (Superadmin)
export const createMember = async (req: Request, res: Response) => {
    try {
        const { username, password, role, chapter_id, generation } = req.body;

        if (!username || !password || !role || !chapter_id || !generation) {
            return res.status(400).json({ 
                message: 'Data tidak lengkap.' 
            });
        }

        // --- VALIDASI PASSWORD DISINI ---
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

// UPDATE PROFILE (Member Sendiri)
export const updateProfile = async (req: Request, res: Response) => {
    try {
        // Asumsi: Kita sudah punya middleware Auth yang menaruh info user di req.user
        // Contoh: const userId = (req as any).user.id;
        // TAPI karena kita belum setup middleware itu di sini, kita ambil ID dari params dulu untuk testing
        // Nanti diganti jadi ID dari Token biar aman (User A gabisa edit profil User B)
        
        const userId = Number(req.params.id); 
        const { full_name, bio, phone } = req.body;
        
        // Handle file upload (foto profil)
        const image = req.file ? req.file.filename : undefined;

        await userService.updateMemberProfile(userId, {
            full_name,
            bio,
            phone,
            image
        });

        res.json({ message: 'Profil berhasil diperbarui' });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const changeUsername = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { username } = req.body; // Username baru

        if (!username || username.trim() === '') {
            return res.status(400).json({ message: 'Username tidak boleh kosong.' });
        }

        // Validasi spasi (opsional, username biasanya tanpa spasi)
        if (/\s/.test(username)) {
             return res.status(400).json({ message: 'Username tidak boleh mengandung spasi.' });
        }

        await userService.updateUsername(id, username);

        res.json({ message: 'Username berhasil diganti!' });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Validasi Input Kosong
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
        }

        // Validasi Konfirmasi Password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Konfirmasi password tidak cocok.' });
        }

        // Validasi Kekuatan Password (Opsional tapi disarankan)
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password baru minimal 8 karakter.' });
        }

        await userService.changePassword(id, { oldPassword, newPassword });

        res.json({ message: 'Password berhasil diperbarui! Silakan login ulang.' });

    } catch (error: any) {
        // Jika error "Password lama salah", kita kirim 400 (Bad Request)
        if (error.message === 'Password lama salah!') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// 3. DELETE MEMBER
export const deleteMember = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        // Validasi ID
        if (!id) return res.status(400).json({ message: 'ID Member tidak valid' });

        // Cegah menghapus diri sendiri (Opsional, tapi disarankan)
        // Anda bisa mengambil ID user yang login dari (req as any).user.id jika sudah pakai middleware auth
        
        await userService.deleteMember(id);
        res.json({ message: 'Member berhasil dihapus' });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};