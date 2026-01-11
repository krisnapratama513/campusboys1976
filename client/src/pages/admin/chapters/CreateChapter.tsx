// client/src/pages/admin/chapters/CreateChapter.tsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createChapter } from '../../../services/chapterService';

/**
 * Halaman Admin: Form Tambah Chapter Baru.
 * Menangani input teks dan upload file gambar logo.
 * * @component
 */
const CreateChapter = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    
    // Preview Image State
    const [preview, setPreview] = useState<string>('');

    /**
     * Menangani perubahan input file.
     * Membuat URL object sementara untuk preview gambar sebelum upload.
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    /**
     * Cleanup Effect:
     * Menghapus URL object preview dari memori saat komponen unmount 
     * atau saat preview berubah, untuk mencegah memory leak.
     */
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    /**
     * Submit Handler.
     * Mengirim data sebagai FormData karena mengandung file binary.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi Sederhana
        if (!name || !file) {
            alert("Nama dan Logo wajib diisi!");
            return;
        }

        setIsLoading(true);
        try {
            // Gunakan FormData untuk upload file
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            // Key 'img' harus sesuai dengan backend: upload.single('img')
            formData.append('img', file); 

            await createChapter(formData);
            alert("Chapter berhasil ditambahkan!");
            navigate('/dashboard/chapters');
        } catch (error: any) {
            alert(error.message || "Gagal membuat chapter");
        } finally {
            setIsLoading(false);
        }
    };

    // Style Helper
    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2>Tambah Chapter Baru</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 20, borderRadius: 8, marginTop: 20 }}>
                
                <label style={{ display: 'block', marginBottom: 5 }}>Nama Chapter</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} placeholder="Nama chapter baru" />

                <label style={{ display: 'block', marginBottom: 5 }}>Deskripsi Singkat</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} style={{...inputStyle, height: 80}} placeholder="Deskripsi chapter" />

                <label style={{ display: 'block', marginBottom: 5 }}>Logo Chapter</label>
                <input type="file" accept="image/*" onChange={handleFileChange} required style={inputStyle} />

                {/* Area Preview Gambar */}
                {preview && (
                    <div style={{ marginBottom: 15, textAlign: 'center' }}>
                        <p style={{fontSize:'0.8rem', color:'#94a3b8'}}>Preview:</p>
                        <img src={preview} alt="Preview" style={{ width: 100, height: 100, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4 }} />
                    </div>
                )}

                {/* Tombol Aksi */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 12, backgroundColor: '#fbbf24', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
                        {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                    <Link to="/dashboard/chapters" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center' }}>Batal</Link>
                </div>
            </form>
        </div>
    );
};

export default CreateChapter;