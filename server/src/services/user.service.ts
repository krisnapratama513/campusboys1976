// server/src/service/user.service.ts

import { pool } from '../config/database';
import bcrypt from 'bcrypt';
import type { MemberProfile } from '../types/user.types';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

/**
 * Mengambil daftar ringkas semua member.
 * Digunakan untuk direktori anggota.
 */
export const getAllMembers = async (): Promise<MemberProfile[]> => {
    const query = `
        SELECT 
            m.id, m.username, m.role, m.chapter_id, m.generation,
            c.name as chapter_name
        FROM members m
        LEFT JOIN chapters c ON m.chapter_id = c.id
        ORDER BY 
            m.generation DESC,
            m.chapter_id ASC
    `;
    const [rows] = await pool.execute<MemberProfile[]>(query);
    return rows;
};

/**
 * Mengambil detail lengkap satu member berdasarkan ID.
 * Termasuk bio, no hp, dan detail lainnya.
 */
export const getMemberById = async (id: number): Promise<MemberProfile | null> => {
    const query = `
        SELECT 
            m.id, m.username, m.role, m.chapter_id, m.generation,
            d.full_name, d.image, d.bio, d.phone,
            c.name as chapter_name
        FROM members m
        LEFT JOIN member_details d ON m.id = d.member_id
        LEFT JOIN chapters c ON m.chapter_id = c.id
        WHERE m.id = ?
    `;
    const [rows] = await pool.execute<MemberProfile[]>(query, [id]);
    return rows[0] || null;
};


/**
 * Admin Only: Mengupdate Role, Chapter, dan Angkatan member.
 */
export const updateMemberAccess = async (id: number, data: any) => {
    const { role, chapter_id, generation } = data;
    const query = `
        UPDATE members 
        SET role = ?, chapter_id = ?, generation = ? 
        WHERE id = ?
    `;
    await pool.execute(query, [role, chapter_id, generation, id]);
};

/**
 * Admin Only: Membuat user baru.
 * Menggunakan Database Transaction (ACID) untuk memastikan
 * data masuk ke tabel 'members' DAN 'member_details' secara bersamaan.
 */
export const createMember = async (data: any) => {
    const { username, password, role, chapter_id, generation } = data;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 1. Insert Login Data
        const [resMember] = await connection.execute<ResultSetHeader>(
            `INSERT INTO members (username, password, role, chapter_id, generation) VALUES (?, ?, ?, ?, ?)`,
            [username, hashedPassword, role, chapter_id, generation]
        );
        const newMemberId = resMember.insertId;

        // 2. Init Detail Data (Wadah Kosong)
        await connection.execute(
            `INSERT INTO member_details (member_id, full_name, bio, phone, image) VALUES (?, ?, ?, ?, 'default_user.png')`,
            [newMemberId, '', '', ''] 
        );

        await connection.commit();
        return newMemberId;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * User Self Service: Update data profil (Bio, Nama, Foto).
 */
export const updateMemberProfile = async (memberId: number, data: any) => {
    const { full_name, bio, phone, image } = data;
    
    if (image) {
        await pool.execute(
            `UPDATE member_details SET full_name = ?, bio = ?, phone = ?, image = ? WHERE member_id = ?`,
            [full_name, bio, phone, image, memberId]
        );
    } else {
        await pool.execute(
            `UPDATE member_details SET full_name = ?, bio = ?, phone = ? WHERE member_id = ?`,
            [full_name, bio, phone, memberId]
        );
    }
};

/**
 * User Self Service: Ganti Username.
 * Melakukan pengecekan duplikasi sebelum update.
 */
export const updateUsername = async (id: number, newUsername: string) => {
    const checkQuery = `SELECT id FROM members WHERE username = ? AND id != ?`;
    const [existing] = await pool.execute<RowDataPacket[]>(checkQuery, [newUsername, id]);

    if (existing.length > 0) {
        throw new Error('Username sudah digunakan user lain!');
    }

    await pool.execute(
        `UPDATE members SET username = ? WHERE id = ?`,
        [newUsername, id]
    );
};

/**
 * Admin Only: Hapus Member permanen.
 */
export const deleteMember = async (id: number) => {
    // Foreign Key constraint 'ON DELETE CASCADE' di DB biasanya sudah menangani hapus detail.
    // Tapi untuk keamanan, query ini cukup menghapus parent-nya saja.
    await pool.execute('DELETE FROM members WHERE id = ?', [id]);
};

/**
 * User Self Service: Ganti Password.
 * Memerlukan verifikasi password lama.
 */
export const changePassword = async (id: number, data: any) => {
    const { oldPassword, newPassword } = data;

    // 1. Ambil hash password saat ini
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT password FROM members WHERE id = ?`, 
        [id]
    );
    
    if (rows.length === 0) throw new Error('User tidak ditemukan.');

    const user = rows[0] as any; 
    const currentHash = user.password;

    // 2. Verifikasi Password Lama
    const isMatch = await bcrypt.compare(oldPassword, currentHash);
    if (!isMatch) {
        throw new Error('Password lama salah!');
    }

    // 3. Hash Password Baru & Simpan
    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.execute(
        `UPDATE members SET password = ? WHERE id = ?`,
        [newHash, id]
    );
};