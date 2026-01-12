// server/src/controllers/author.controller.ts

/**
 * ==============================================================================
 * AUTHOR CONTROLLER
 * ==============================================================================
 * Menangani request HTTP untuk modul Author.
 * Menghandle validasi input dasar dan error spesifik database (Duplicate/FK).
 */

import { Request, Response } from 'express';
import * as authorService from '../services/author.service';

/**
 * GET All Authors
 * Mengembalikan daftar author beserta statistiknya.
 */
export const getAllAuthors = async (req: Request, res: Response) => {
    try {
        const authors = await authorService.getAllAuthors();
        res.json({
            message: 'Berhasil ambil data authors',
            data: authors
        });
    } catch (error: any) {
        console.error("[AuthorController] GetAll Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * GET Author By ID
 * Mengembalikan detail satu author.
 */
export const getAuthorById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const author = await authorService.getAuthorById(id);

        if (!author) {
            return res.status(404).json({ message: 'Author tidak ditemukan' });
        }

        res.json({ data: author });
    } catch (error: any) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

/**
 * POST Create Author
 * Menambahkan penulis baru.
 */
export const createAuthor = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Nama harus diisi' });

        await authorService.createAuthor(name);

        res.status(201).json({ message: 'Author berhasil ditambahkan' });
    } catch (error: any) {
        // Handle Duplicate Entry (Nama kembar)
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({ 
                message: 'Gagal! Nama author sudah terdaftar.'
            });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * PUT Update Author
 * Mengganti nama penulis.
 */
export const updateAuthor = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;

        if (!name) return res.status(400).json({ message: 'Nama harus diisi' });

        await authorService.updateAuthor(id, name);

        res.json({ message: 'Author berhasil diupdate' });
    } catch (error: any) {
        // Handle Duplicate Entry saat update
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({
                message: 'Gagal update! Nama tersebut sudah digunakan author lain.'
            });
        }
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

/**
 * DELETE Author
 * Menghapus penulis. Gagal jika penulis masih punya karya.
 */
export const deleteAuthor = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await authorService.deleteAuthor(id); 

        res.json({ message: 'Author berhasil dihapus' });

    } catch (error: any) {
        // Handle Foreign Key Constraint (Sedang dipakai)
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
            return res.status(400).json({
                message: 'Gagal! Author ini tidak bisa dihapus karena masih memiliki Artikel atau Fanzine.'
            });
        }
        res.status(500).json({ message: 'Gagal menghapus data', error: error.message });
    }
};