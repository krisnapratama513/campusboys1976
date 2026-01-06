// server/src/controllers/articles.controller.ts
import type { Request, Response } from 'express';
import * as articleService from '../services/article.service';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';

// Konfigurasi Folder Target
const targetDir = path.join(__dirname, '../../../client/public/article');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

// ==========================================
// PUBLIC CONTROLLERS (Milik Anda Sebelumnya)
// ==========================================

export const getRecentArticlesCard = async (req: Request, res: Response) => {
    try {
        const articles = await articleService.fetchRecentArticlesCard();
        res.json(articles);
    } catch (error) {
        console.error("Error getRecentArticlesCard: ", error);
        res.status(500).json({ message: "Gagal mengambil data recent articles" });
    }
};

export const getAllArticlesCard = async (req: Request, res: Response) => {
    try {
        const articles = await articleService.fetchAllArticlesCard();
        res.json(articles);
    } catch (error) {
        console.error("Error getAllArticlesCard: ", error);
        res.status(500).json({ message: "Gagal mengambil data all articles" });
    }
};

export const getArticleBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        if (!slug) return res.status(400).json({ message: "Slug tidak ditemukan" });

        const articles = await articleService.fetchArticleBySlug(slug);
        
        // Cek array kosong
        if (!articles || articles.length === 0) {
            return res.status(404).json({ message: "Artikel tidak ditemukan" });
        }
        
        // Best Practice: Return object langsung jika detail, bukan array
        // Tapi jika frontend Anda sudah terbiasa array, biarkan array.
        res.json(articles); 
    } catch (error) {
        console.error("Error getArticleBySlug: ", error);
        res.status(500).json({ message: "Gagal mengambil detail artikel" });
    }
};

// ==========================================
// ADMIN CONTROLLERS (CRUD Baru)
// ==========================================

// 1. Get List Admin (Table View)
export const getAdminArticlesList = async (req: Request, res: Response) => {
    try {
        const data = await articleService.getAdminArticles();
        res.json({ data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Get Detail By ID (Untuk Edit Form)
export const getArticleById = async (req: Request, res: Response) => {
    try {
        const data = await articleService.getArticleById(Number(req.params.id));
        if (!data) return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        res.json({ data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Create Article (Dengan Upload & Slug)
export const createArticle = async (req: Request, res: Response) => {
    try {
        // const { id_author, title, status, password, content, description } = req.body;

        // // Insert Text Data
        // const newId = await articleService.createArticleInitial({
        //     id_author, title, status, password, content, description,
        //     created_at: new Date()
        // });

        const { id_author, title, status, password, content, description } = req.body;

        // 1. Insert DB
        const newId = await articleService.createArticleInitial({
            id_author, 
            title, 
            status, 
            
            // --- PERBAIKAN DI SINI ---
            // Jika password tidak ada (undefined/kosong), kirim null
            password: password || null, 
            
            // Jaga-jaga description juga undefined
            content, 
            description: description || null, 
            
            created_at: new Date()
        });

        // Buat Slug & File
        const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
        const slug = `${newId}_${cleanTitle}`;
        let finalImgName = 'default.png';

        if (req.file) {
            const ext = path.extname(req.file.originalname);
            finalImgName = `${slug}${ext}`;
            fs.renameSync(req.file.path, path.join(targetDir, finalImgName));
        }

        // Update Slug & Img di DB
        await articleService.updateArticleFileAndSlug(newId, slug, finalImgName);

        res.status(201).json({ message: 'Artikel berhasil dibuat', data: { id: newId } });

    } catch (err: any) {
        res.status(500).json({ message: 'Gagal membuat artikel', error: err.message });
    }
};

/**
 * Update existing article
 * Handles: Data updates, File replacement, Slug regeneration, and Security checks.
 */
export const updateArticle = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { id_author, title, status, password, content, description, confirm_password } = req.body;
        
        // 1. Fetch Existing Data (Required for comparison and file cleanup)
        const oldData = await articleService.getArticleById(id) as any;
        if (!oldData) {
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        }

        // 2. Security Verification (Second-layer protection)
        // If the article is protected, user must provide the old password to authorize changes.
        if (oldData.password && oldData.password !== '') {
            if (confirm_password !== oldData.password) {
                // Cleanup: Delete the uploaded temp file if authentication fails to prevent storage clutter
                if (req.file) fs.unlinkSync(req.file.path);
                
                return res.status(403).json({ message: 'Password salah! Update ditolak.' });
            }
        }

        // 3. Slug Regeneration Logic
        // Only regenerate slug if the title has changed to maintain SEO consistency.
        let newSlug = oldData.slug;
        if (title && title !== oldData.title) {
            const cleanTitle = slugify(title, { lower: true, strict: true, replacement: '_' });
            newSlug = `${id}_${cleanTitle}`;
        }

        // 4. File Management (Image Handling)
        let finalImgName = undefined; // Default: undefined means "do not update image column"

        if (req.file) {
            // CASE A: User uploaded a NEW image
            
            // Step A1: Delete old image (Prevent checking default.png to avoid deleting system assets)
            if (oldData.img && oldData.img !== 'default.png') {
                const oldPath = path.join(targetDir, oldData.img);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            
            // Step A2: Rename and move new image from temp to public
            const ext = path.extname(req.file.originalname);
            finalImgName = `${newSlug}${ext}`;
            fs.renameSync(req.file.path, path.join(targetDir, finalImgName));

        } else if (newSlug !== oldData.slug && oldData.img && oldData.img !== 'default.png') {
            // CASE B: Title changed (slug changed), but NO new image uploaded.
            // We must rename the existing image file to match the new slug structure.
            
            const ext = path.extname(oldData.img);
            const newImgName = `${newSlug}${ext}`;
            const oldPath = path.join(targetDir, oldData.img);
            const newPath = path.join(targetDir, newImgName);

            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, newPath);
                finalImgName = newImgName; // Update DB with new filename
            }
        }

        // 5. Persist Data to Database
        
        // Update textual information
        await articleService.updateArticleInfo(id, { 
            id_author, 
            title, 
            status, 
            
            // CRITICAL FIX: Handle undefined password
            // Logic: If 'password' is sent (user typed something), use it. 
            // If it's undefined (user left it blank), keep the 'oldData.password'.
            password: password !== undefined ? password : oldData.password, 
            
            content, 
            description 
        });
        
        // Update file path and slug references
        await articleService.updateArticleFileAndSlug(id, newSlug, finalImgName);

        // 6. Send Success Response
        res.json({ message: 'Artikel berhasil diupdate' });

    } catch (err: any) {
        console.error("Update Article Error:", err); // Log for server-side debugging
        res.status(500).json({ message: 'Gagal update', error: err.message });
    }
};

// 5. Delete Article
export const deleteArticle = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { confirm_password } = req.body;

        const oldData = await articleService.getArticleById(id) as any;
        if (!oldData) return res.status(404).json({ message: 'Artikel tidak ditemukan' });

        if (oldData.password && oldData.password !== '') {
            if (confirm_password !== oldData.password) {
                return res.status(403).json({ message: 'Password salah!' });
            }
        }

        if (oldData.img && oldData.img !== 'default.png') {
            const imgPath = path.join(targetDir, oldData.img);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

        await articleService.deleteArticle(id);
        res.json({ message: 'Artikel berhasil dihapus' });
    } catch (err: any) {
        res.status(500).json({ message: 'Gagal hapus', error: err.message });
    }
};