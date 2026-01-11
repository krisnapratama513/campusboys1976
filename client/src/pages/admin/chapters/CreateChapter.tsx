import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createChapter } from '../../../services/chapterService';

const CreateChapter = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    // Cleanup memory
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name || !file) {
            alert("Nama dan Logo wajib diisi!");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('img', file); // Key harus 'img' sesuai backend

            await createChapter(formData);
            alert("Chapter berhasil ditambahkan!");
            navigate('/dashboard/chapters');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2>Tambah Chapter Baru</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 20, borderRadius: 8, marginTop: 20 }}>
                
                <label style={{ display: 'block', marginBottom: 5 }}>Nama Chapter</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} placeholder="Contoh: Chapter Sleman" />

                <label style={{ display: 'block', marginBottom: 5 }}>Deskripsi Singkat</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} style={{...inputStyle, height: 80}} placeholder="Deskripsi singkat wilayah..." />

                <label style={{ display: 'block', marginBottom: 5 }}>Logo Chapter</label>
                <input type="file" accept="image/*" onChange={handleFileChange} required style={inputStyle} />

                {preview && (
                    <div style={{ marginBottom: 15, textAlign: 'center' }}>
                        <p style={{fontSize:'0.8rem', color:'#94a3b8'}}>Preview:</p>
                        <img src={preview} alt="Preview" style={{ width: 100, height: 100, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4 }} />
                    </div>
                )}

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