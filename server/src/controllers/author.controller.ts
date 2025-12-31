// server/src/controllers/author.controller.ts

import { Request, Response } from 'express';
import * as authorService from '../services/author.service'; // Import Service

export const getAllAuthors = async (req: Request, res: Response) => {
    try {
        // Panggil Koki (Service)
        const authors = await authorService.getAllAuthors();

        // Kirim ke Pelanggan (Response)
        res.json({
            message: 'Berhasil ambil data authors',
            data: authors
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const createAuthor = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Nama harus diisi' });

        await authorService.createAuthor(name);

        res.status(201).json({ message: 'Author berhasil ditambahkan' });
    } catch (error: any) {
        // --- TAMBAHAN BARU: Handle Duplicate Entry ---
        // Error 1062 / ER_DUP_ENTRY artinya data unik dilanggar
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({ // 409 = Conflict
                message: 'Gagal! Nama author sudah terdaftar. Silakan gunakan nama lain.'
            });
        }
        // ---------------------------------------------

        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

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

// PUT: Simpan perubahan
export const updateAuthor = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;

        if (!name) return res.status(400).json({ message: 'Nama harus diisi' });

        await authorService.updateAuthor(id, name);

        res.json({ message: 'Author berhasil diupdate' });
    } catch (error: any) {
        // --- TAMBAHAN BARU: Handle Duplicate Entry ---
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({
                message: 'Gagal update! Nama author tersebut sudah digunakan oleh author lain.'
            });
        }
        // ---------------------------------------------

        res.status(500).json({ message: 'Error', error: error.message });
    }
};

export const deleteAuthor = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        await authorService.deleteAuthor(id); // <--- Coba hapus

        res.json({ message: 'Author berhasil dihapus' });

    } catch (error: any) {
        // CEK ERROR SPESIFIK MYSQL
        // Kode 1451 / ER_ROW_IS_REFERENCED_2 artinya data sedang dipakai tabel lain
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
            return res.status(400).json({
                message: 'Gagal! Author ini tidak bisa dihapus karena masih terhubung dengan Artikel/Magazine yang ada.'
            });
        }

        res.status(500).json({ message: 'Gagal menghapus data', error: error.message });
    }
};