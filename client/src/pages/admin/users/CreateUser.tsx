// client/src/pages/admin/users/CreateUser.tsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createMember } from '../../../services/userService';
import { getChapters } from '../../../services/chapterService'; 
import type { Chapter } from '../../../types/chapter.types';

/**
 * Halaman Admin: Buat User Baru.
 * Fitur:
 * - Load data Chapters untuk dropdown.
 * - Validasi Password (Kuat: Huruf Besar + Angka).
 * - Submit data ke API (Protected Route).
 * * @component
 */
const CreateUser = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    // State Form
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'member',
        chapter_id: '',
        generation: 8 // Default Value
    });

    // State Data Pendukung
    const [chapters, setChapters] = useState<Chapter[]>([]);

    /**
     * Effect: Load Chapters
     */
    useEffect(() => {
        getChapters()
            .then(data => setChapters(data))
            .catch(err => console.error("Gagal load chapters:", err));
    }, []);

    // Helper: Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Submit Handler
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. Validasi Chapter Wajib Pilih
        if (!formData.chapter_id) {
            alert("Silakan pilih Chapter terlebih dahulu!");
            return;
        }

        // 2. Validasi Kekuatan Password
        const pwd = formData.password;
        const isStrong = pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd);
        
        if (!isStrong) {
            alert("Password Lemah!\nHarus minimal 8 karakter, mengandung Huruf Besar dan Angka.");
            return; 
        }

        setIsLoading(true);

        try {
            await createMember({
                username: formData.username,
                password: formData.password,
                role: formData.role as any,
                chapter_id: Number(formData.chapter_id),
                generation: Number(formData.generation)
            });

            alert("Member berhasil ditambahkan!");
            navigate('/dashboard/users');

        } catch (error: any) {
            // Tampilkan error dari backend (misal: "Username sudah digunakan")
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Style Helper
    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    
    // Array Generasi 1-13
    const generations = Array.from({ length: 13 }, (_, i) => i + 1);

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2 style={{ marginBottom: 10 }}>Tambah Member Baru</h2>
            <p style={{ marginBottom: 20, color: '#94a3b8', fontSize: '0.9rem' }}>
                Akun ini akan langsung aktif. Member bisa melengkapi profil bio & foto mereka sendiri setelah login.
            </p>
            
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 25, borderRadius: 8, border: '1px solid #1e293b' }}>
                
                {/* Username */}
                <label style={{ display: 'block', marginBottom: 5, color: '#94a3b8' }}>Username (Login)</label>
                <input 
                    type="text" name="username" required 
                    value={formData.username} onChange={handleChange} 
                    style={inputStyle} placeholder="Contoh: jokosleman" 
                />

                {/* Password */}
                <label style={{ display: 'block', marginBottom: 5, color: '#94a3b8' }}>Password Awal</label>
                <input 
                    type="text" name="password" required 
                    value={formData.password} onChange={handleChange} 
                    style={inputStyle} placeholder="Minimal 8 karakter (Huruf Besar + Angka)" 
                />

                <div style={{ display: 'flex', gap: 20 }}>
                    {/* Role */}
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#94a3b8' }}>Role / Jabatan</label>
                        <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
                            <option value="member">Member</option>
                            <option value="creative">Creative Team</option>
                            <option value="editor">Editor (Penulis)</option>
                            <option value="superadmin">Superadmin</option>
                        </select>
                    </div>

                    {/* Generasi */}
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#94a3b8' }}>Generasi</label>
                        <select name="generation" value={formData.generation} onChange={handleChange} style={inputStyle}>
                            {generations.map((gen) => (
                                <option key={gen} value={gen}>Gen {gen}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Chapter */}
                <label style={{ display: 'block', marginBottom: 5, color: '#94a3b8' }}>Asal Chapter</label>
                <select name="chapter_id" required value={formData.chapter_id} onChange={handleChange} style={inputStyle}>
                    <option value="">-- Pilih Chapter --</option>
                    {chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                </select>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
                    <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 12, backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
                        {isLoading ? 'Menyimpan...' : 'Buat Member'}
                    </button>
                    <Link to="/dashboard/users" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center', fontWeight:'500' }}>
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CreateUser;