import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createMember } from '../../../services/userService';

// UPDATE: Kita ganti import service agar dapat 'Nama Chapter'
import { getChapters } from '../../../services/chapterService'; 
import type { Chapter } from '../../../types/chapter.types';

const CreateUser = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    // State Form
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'member',
        chapter_id: '',
        generation: 8 // Default
    });

    // State untuk List Chapter (Full Data: ID, Name, Img)
    const [chapters, setChapters] = useState<Chapter[]>([]);

    // Load Chapters saat component mount
    useEffect(() => {
        // Panggil service yang mengambil seluruh data chapter (termasuk Nama)
        getChapters()
            .then(data => setChapters(data))
            .catch(err => console.error("Gagal load chapters:", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. Validasi Chapter
        if (!formData.chapter_id) {
            alert("Silakan pilih Chapter terlebih dahulu!");
            return;
        }

        // 2. --- VALIDASI PASSWORD ---
        const pwd = formData.password;
        const isStrong = pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd);
        
        if (!isStrong) {
            alert("Password Lemah!\nHarus minimal 8 karakter, ada huruf Besar, dan Angka.");
            return; // Stop proses
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
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };

    // Helper untuk membuat array angka 1 sampai 13
    const generations = Array.from({ length: 13 }, (_, i) => i + 1);

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2>Tambah Member Baru</h2>
            <p style={{ marginBottom: 20, color: '#94a3b8' }}>Akun ini akan langsung aktif. Member bisa melengkapi profil mereka sendiri setelah login.</p>
            
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 25, borderRadius: 8 }}>
                
                {/* 1. Username */}
                <label style={{ display: 'block', marginBottom: 5 }}>Username (Login)</label>
                <input 
                    type="text" name="username" required 
                    value={formData.username} onChange={handleChange} 
                    style={inputStyle} placeholder="Contoh: jokosleman" 
                />

                {/* 2. Password */}
                <label style={{ display: 'block', marginBottom: 5 }}>Password Awal</label>
                <input 
                    type="text" name="password" required 
                    value={formData.password} onChange={handleChange} 
                    style={inputStyle} placeholder="Password sementara..." 
                />

                <div style={{ display: 'flex', gap: 20 }}>
                    {/* 3. Role */}
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: 5 }}>Role / Jabatan</label>
                        <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
                            <option value="member">Member</option>
                            <option value="creative">Creative Team</option>
                            <option value="editor">Editor (Penulis)</option>
                            <option value="superadmin">Superadmin</option>
                        </select>
                    </div>

                    {/* 4. Generasi (Dropdown 1-13) */}
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: 5 }}>Generasi</label>
                        <select 
                            name="generation" 
                            value={formData.generation} 
                            onChange={handleChange} 
                            style={inputStyle}
                        >
                            {generations.map((gen) => (
                                <option key={gen} value={gen}>
                                    Gen {gen}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 5. Chapter Dropdown (Menampilkan Nama) */}
                <label style={{ display: 'block', marginBottom: 5 }}>Asal Chapter</label>
                <select 
                    name="chapter_id" required 
                    value={formData.chapter_id} onChange={handleChange} 
                    style={inputStyle}
                >
                    <option value="">-- Pilih Chapter --</option>
                    {chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>
                            {ch.name} {/* Sekarang tampil Nama Chapter */}
                        </option>
                    ))}
                </select>

                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 12, backgroundColor: '#fbbf24', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
                        {isLoading ? 'Menyimpan...' : 'Buat Member'}
                    </button>
                    <Link to="/dashboard/users" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center' }}>Batal</Link>
                </div>
            </form>
        </div>
    );
};

export default CreateUser;