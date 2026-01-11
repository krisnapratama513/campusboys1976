// server/src/service/user.service.ts

import { pool } from '../config/database';
import bcrypt from 'bcrypt';
import type { MemberProfile , Member} from '../types/user.types';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export const getAllMembers = async () => {
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

// GET MEMBER BY ID (VERSI LENGKAP - UNTUK MODAL DETAIL)
// Ini dipanggil cuma saat tombol 'Detail' diklik
export const getMemberById = async (id: number) => {
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


// KHUSUS ADMIN: Update Role, Chapter, & Generation
export const updateMemberAccess = async (id: number, data: any) => {
    const { role, chapter_id, generation } = data;
    
    // Kita update tabel 'members' (bukan member_details)
    const query = `
        UPDATE members 
        SET role = ?, chapter_id = ?, generation = ? 
        WHERE id = ?
    `;
    
    await pool.execute(query, [role, chapter_id, generation, id]);
};

// 2. CREATE MEMBER (Superadmin Only)
// 2. CREATE MEMBER (Superadmin: Init Empty Detail)
export const createMember = async (data: any) => {
    // HAPUS full_name dari parameter, Superadmin tidak perlu tau
    const { username, password, role, chapter_id, generation } = data;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // A. Insert Auth Data
        const [resMember] = await connection.execute<ResultSetHeader>(
            `INSERT INTO members (username, password, role, chapter_id, generation) VALUES (?, ?, ?, ?, ?)`,
            [username, hashedPassword, role, chapter_id, generation]
        );
        const newMemberId = resMember.insertId;

        // B. Insert "WADAH KOSONG" ke member_details
        // Kita isi full_name dengan string kosong '' agar tidak NULL
        // Image otomatis default dari database ('default_user.png')
        await connection.execute(
            `INSERT INTO member_details (member_id, full_name, bio, phone) VALUES (?, ?, ?, ?)`,
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

// 3. UPDATE PROFILE (Fitur baru untuk Member)
// Ini nanti dipanggil member sendiri di halaman "My Profile"
export const updateMemberProfile = async (memberId: number, data: any) => {
    const { full_name, bio, phone, image } = data;
    
    // Logicnya simpel: UPDATE saja, karena barisnya PASTI sudah dibuatkan Superadmin
    // Kita cek dulu apakah ada image baru diupload atau tidak
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

// GANTI USERNAME (Cek duplikat dulu)
export const updateUsername = async (id: number, newUsername: string) => {
    // 1. Cek apakah username sudah dipakai orang LAIN
    // (Kita kecualikan user itu sendiri, kalau dia input username lama dia sendiri gak masalah)
    const checkQuery = `SELECT id FROM members WHERE username = ? AND id != ?`;
    const [existing] = await pool.execute<RowDataPacket[]>(checkQuery, [newUsername, id]);

    if (existing.length > 0) {
        throw new Error('Username sudah digunakan user lain!');
    }

    // 2. Update Username
    await pool.execute(
        `UPDATE members SET username = ? WHERE id = ?`,
        [newUsername, id]
    );
};

// 3. DELETE MEMBER
export const deleteMember = async (id: number) => {
    await pool.execute('DELETE FROM members WHERE id = ?', [id]);
};

// GANTI PASSWORD
export const changePassword = async (id: number, data: any) => {
    const { oldPassword, newPassword } = data;

    // 1. Ambil password hash
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT password FROM members WHERE id = ?`, 
        [id]
    );
    
    if (rows.length === 0) throw new Error('User tidak ditemukan.');

    // --- PERBAIKAN DI SINI ---
    // Kita paksa TS menganggap rows[0] sebagai object 'any' agar bisa akses .password
    const user = rows[0] as any; 
    const currentHash = user.password;

    // 2. Bandingkan Password
    const isMatch = await bcrypt.compare(oldPassword, currentHash);
    if (!isMatch) {
        throw new Error('Password lama salah!');
    }

    // 3. Hash Password Baru
    const newHash = await bcrypt.hash(newPassword, 10);

    // 4. Update Database
    await pool.execute(
        `UPDATE members SET password = ? WHERE id = ?`,
        [newHash, id]
    );
};