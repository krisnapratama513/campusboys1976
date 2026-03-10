// server/src/controllers/articles.controller.ts

/**
 * ==============================================================================
 * ARTICLES CONTROLLER
 * ==============================================================================
 * Menangani request/response HTTP untuk modul Artikel.
 * Termasuk logika upload file, rename file sesuai slug, dan manajemen file fisik.
 */

import type { Request, Response } from 'express';
import * as articleService from '../services/article.service';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';

// --- KONFIGURASI FOLDER PENYIMPANAN ---
// Mengarah ke 'server/uploads/articles'
const targetDir = path.join(__dirname, '../../uploads/articles');

// Pastikan folder ada (mkdir -p)
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// [BARU] Helper: Membersihkan HTML Content dari karakter bandel
const sanitizeContent = (htmlContent: string): string => {
    if (!htmlContent) return "";
    // Mengganti &nbsp; (Non-Breaking Space) dengan spasi biasa
    return htmlContent.replace(/&nbsp;/g, ' ');
};

// ==========================================
// PUBLIC CONTROLLERS (READ ONLY)
// ==========================================

export const getRecentArticlesCard = async (req: Request, res: Response) => {
    try {
        const articles = await articleService.fetchRecentArticlesCard();
        res.json(articles);
    } catch (error) {
        console.error("[Articles] getRecent Error:", error);
        res.status(500).json({ message: "Gagal mengambil data recent articles" });
    }
};

export const getAllArticlesCard = async (req: Request, res: Response) => {
    try {
        // Tangkap query ?page= dari URL, default ke 1
        const page = parseInt(req.query.page as string) || 1;
        const limit = 9;
        const offset = (page - 1) * limit;

        // Panggil service dengan parameter pagination
        const { articles, totalItems } = await articleService.fetchAllArticlesCard(limit, offset);
        
        const totalPages = Math.ceil(totalItems / limit);

        // Format response disamakan dengan Album agar di Frontend konsisten
        res.json({
            message: 'Success',
            data: articles,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems,
                limit: limit
            }
        });
    } catch (error) {
        console.error("[Articles] getAll Error:", error);
        res.status(500).json({ message: "Gagal mengambil data all articles" });
    }
};

export const getArticleBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        if (!slug) return res.status(400).json({ message: "Slug wajib diisi" });

        const articles = await articleService.fetchArticleBySlug(slug);
        
        if (!articles || articles.length === 0) {
            return res.status(404).json({ message: "Artikel tidak ditemukan" });
        }
        
        res.json(articles); 
    } catch (error) {
        console.error("[Articles] getBySlug Error:", error);
        res.status(500).json({ message: "Gagal mengambil detail artikel" });
    }
};

// ==========================================
// ADMIN CONTROLLERS (CRUD & FILE MANAGER)
// ==========================================

/**
 * GET List Admin
 * Mengambil semua data untuk tabel dashboard admin.
 */
export const getAdminArticlesList = async (req: Request, res: Response) => {
    try {
        const data = await articleService.getAdminArticles();
        res.json({ data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET Detail By ID
 * Digunakan untuk mengisi form edit.
 */
export const getArticleById = async (req: Request, res: Response) => {
    try {
        const data = await articleService.getArticleById(Number(req.params.id));
        if (!data) return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        res.json({ data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * CREATE Article
 * 1. Insert data teks dulu ke DB (dapat ID).
 * 2. Generate slug dari Title.
 * 3. Rename file upload sesuai slug.
 * 4. Update record DB dengan slug dan nama file baru.
 */
export const createArticle = async (req: Request, res: Response) => {
    try {
        const { id_author, title, status, password, content, description } = req.body;

        const cleanContent = sanitizeContent(content);

        // 1. Insert DB (Initial)
        const newId = await articleService.createArticleInitial({
            id_author, 
            title, 
            status, 
            password: password || null, 
            content : cleanContent, 
            description: description || null, 
            created_at: new Date()
        });

        // 2. Generate Slug & File Name
        // Slugify: "Berita Hari Ini!" -> "newId_berita_hari_ini"
        const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
        const slug = `${newId}_${cleanTitle}`;
        let finalImgName = 'default.png';

        // 3. Handle File Upload
        if (req.file) {
            const ext = path.extname(req.file.originalname);
            finalImgName = `${slug}${ext}`; // Nama file mengikuti slug
            
            // Pindahkan dari folder temp (multer) ke folder uploads
            // Note: Multer default-nya sudah menaruh di 'uploads/articles' (sesuai config router),
            // jadi kita tinggal rename saja.
            fs.renameSync(req.file.path, path.join(targetDir, finalImgName));
        }

        // 4. Update Slug & Img di DB
        await articleService.updateArticleFileAndSlug(newId, slug, finalImgName);

        res.status(201).json({ message: 'Artikel berhasil dibuat', data: { id: newId } });

    } catch (err: any) {
        // Cleanup: Hapus file jika upload sukses tapi insert DB gagal
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Gagal membuat artikel', error: err.message });
    }
};

/**
 * UPDATE Article
 * Menangani logika update kompleks: ganti gambar, ganti judul (rename file), dan proteksi password.
 */
export const updateArticle = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { id_author, title, status, password, content, description, confirm_password } = req.body;
        
        // 1. Ambil Data Lama
        const oldData = await articleService.getArticleById(id) as any;
        if (!oldData) {
            // Cleanup jika user upload file tapi ID salah
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        }

        // 2. Cek Password Lama (Proteksi Double)
        if (oldData.password && oldData.password !== '') {
            if (confirm_password !== oldData.password) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(403).json({ message: 'Password artikel salah! Update ditolak.' });
            }
        }

        // 3. Cek Perubahan Slug
        let newSlug = oldData.slug;
        if (title && title !== oldData.title) {
            const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
            newSlug = `${id}_${cleanTitle}`;
        }

        // 4. Manajemen File
        let finalImgName = undefined;

        if (req.file) {
            // A. User upload gambar BARU
            
            // Hapus gambar lama (kecuali default)
            if (oldData.img && oldData.img !== 'default.png') {
                const oldPath = path.join(targetDir, oldData.img);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            
            // Simpan gambar baru dengan nama slug baru
            const ext = path.extname(req.file.originalname);
            finalImgName = `${newSlug}${ext}`;
            fs.renameSync(req.file.path, path.join(targetDir, finalImgName));

        } else if (newSlug !== oldData.slug && oldData.img && oldData.img !== 'default.png') {
            // B. User TIDAK upload gambar, tapi JUDUL berubah (Slug berubah)
            // Kita harus rename file gambar lama agar tetap sinkron dengan slug baru
            
            const ext = path.extname(oldData.img);
            const newImgName = `${newSlug}${ext}`;
            const oldPath = path.join(targetDir, oldData.img);
            const newPath = path.join(targetDir, newImgName);

            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, newPath);
                finalImgName = newImgName; // Update nama file di DB
            }
        }

        // 5. Update Database
        const cleanContent = sanitizeContent(content);
        await articleService.updateArticleInfo(id, { 
            id_author, 
            title, 
            status, 
            // Logic: Jika password dikirim (string kosong atau isi), pakai itu. Jika undefined, pakai lama.
            password: password !== undefined ? password : oldData.password, 
            content : cleanContent, 
            description 
        });
        
        await articleService.updateArticleFileAndSlug(id, newSlug, finalImgName);

        res.json({ message: 'Artikel berhasil diupdate' });

    } catch (err: any) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error("Update Article Error:", err);
        res.status(500).json({ message: 'Gagal update', error: err.message });
    }
};

/**
 * DELETE Article
 * Menghapus data di DB dan file fisik di server.
 */
export const deleteArticle = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { confirm_password } = req.body; // Jika delete butuh konfirmasi password artikel

        const oldData = await articleService.getArticleById(id) as any;
        if (!oldData) return res.status(404).json({ message: 'Artikel tidak ditemukan' });

        // Cek Password Artikel (jika ada)
        if (oldData.password && oldData.password !== '') {
            if (confirm_password !== oldData.password) {
                return res.status(403).json({ message: 'Password salah!' });
            }
        }

        // Hapus File Fisik
        if (oldData.img && oldData.img !== 'default.png') {
            const imgPath = path.join(targetDir, oldData.img);
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        }

        // Hapus Data DB
        await articleService.deleteArticle(id);
        res.json({ message: 'Artikel berhasil dihapus' });
    } catch (err: any) {
        res.status(500).json({ message: 'Gagal hapus', error: err.message });
    }
};