import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getChapterById, updateChapter } from '../../../services/chapterService';

const EditChapter = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [currentImg, setCurrentImg] = useState(''); // Gambar dari DB
    const [file, setFile] = useState<File | null>(null); // Gambar baru (opsional)
    const [preview, setPreview] = useState<string>(''); // Preview gambar baru

    // Load Data
    useEffect(() => {
        if (id) {
            getChapterById(id)
                .then(data => {
                    setName(data.name);
                    setDescription(data.description || '');
                    setCurrentImg(data.img);
                    setIsLoading(false);
                })
                .catch(err => {
                    alert("Gagal load data: " + err.message);
                    navigate('/dashboard/chapters');
                });
        }
    }, [id, navigate]);

    // Handle File Baru
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    // Cleanup Preview
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            
            // Hanya append jika user upload gambar baru
            if (file) {
                formData.append('img', file);
            }

            await updateChapter(id!, formData);
            alert("Chapter berhasil diupdate!");
            navigate('/dashboard/chapters');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };

    if (isLoading) return <div style={{padding:20, color:'white'}}>Memuat data...</div>;

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2>Edit Chapter</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 20, borderRadius: 8, marginTop: 20 }}>
                
                <label style={{ display: 'block', marginBottom: 5 }}>Nama Chapter</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />

                <label style={{ display: 'block', marginBottom: 5 }}>Deskripsi Singkat</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} style={{...inputStyle, height: 80}} />

                <label style={{ display: 'block', marginBottom: 5 }}>Ganti Logo (Opsional)</label>
                
                {/* Tampilkan logo lama jika belum ada preview baru */}
                {!preview && currentImg && (
                    <div style={{ marginBottom: 10, display:'flex', alignItems:'center', gap: 10 }}>
                        <img src={`/chapters/${currentImg}`} alt="Old" style={{ width: 60, height: 60, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4 }} />
                        <span style={{fontSize:'0.8rem', color:'#94a3b8'}}>&larr; Logo saat ini</span>
                    </div>
                )}

                <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />

                {preview && (
                    <div style={{ marginBottom: 15 }}>
                        <p style={{fontSize:'0.8rem', color:'#fbbf24'}}>Akan diganti menjadi:</p>
                        <img src={preview} alt="New Preview" style={{ width: 80, height: 80, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4 }} />
                    </div>
                )}

                <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 12, backgroundColor: '#fbbf24', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <Link to="/dashboard/chapters" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center' }}>Batal</Link>
                </div>
            </form>
        </div>
    );
};

export default EditChapter;