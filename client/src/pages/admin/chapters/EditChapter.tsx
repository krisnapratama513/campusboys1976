// client/src/pages/admin/chapters/EditChapter.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getChapterById, updateChapter } from '../../../services/chapterService';
import { SERVER_ROOT } from '../../../config/api'; // Import Config URL
import { getErrorMessage } from '../../../utils/errorHandler';

/**
 * Halaman Admin: Edit Chapter.
 * Memungkinkan admin mengubah nama, deskripsi, dan mengganti logo chapter.
 * * @component
 */
const EditChapter = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Form States
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    
    // Image States
    const [currentImg, setCurrentImg] = useState(''); // Nama file gambar lama dari DB
    const [file, setFile] = useState<File | null>(null); // File gambar baru (jika user upload)
    const [preview, setPreview] = useState<string>(''); // Preview URL lokal untuk gambar baru

    /**
     * Effect: Load Data Chapter saat Mount.
     * Mengambil detail chapter berdasarkan ID dari URL.
     */
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
                    alert("Gagal memuat data: " + err.message);
                    navigate('/dashboard/chapters');
                });
        }
    }, [id, navigate]);

    /**
     * Menangani perubahan input file.
     * Membuat preview lokal agar user bisa melihat gambar sebelum di-upload.
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    /**
     * Cleanup Effect.
     * Membersihkan URL preview dari memori saat komponen unmount atau preview berubah.
     */
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    /**
     * Submit Handler.
     * Mengirim data update ke server menggunakan FormData.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            
            // Logic: Hanya kirim field 'img' jika user benar-benar memilih file baru
            if (file) {
                formData.append('img', file);
            }

            await updateChapter(id!, formData);
            alert("Chapter berhasil diperbarui!");
            navigate('/dashboard/chapters');
        } catch (error) {
            alert("Gagal mengupdate chapter" + getErrorMessage(error));
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
                
                {/* Tampilkan Logo LAMA (dari Server) jika belum ada preview baru */}
                {!preview && currentImg && (
                    <div style={{ marginBottom: 15, display:'flex', alignItems:'center', gap: 15, padding: 10, border: '1px dashed #475569', borderRadius: 6 }}>
                        <img 
                            // UPDATE PATH GAMBAR DISINI
                            src={`${SERVER_ROOT}/uploads/chapters/${currentImg}`} 
                            alt="Current Logo" 
                            style={{ width: 60, height: 60, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4 }} 
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/60?text=No+Img')}
                        />
                        <div>
                            <span style={{fontSize:'0.85rem', color:'#94a3b8', display:'block'}}>Logo saat ini</span>
                            <span style={{fontSize:'0.75rem', color:'#64748b'}}>{currentImg}</span>
                        </div>
                    </div>
                )}

                <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />

                {/* Tampilkan Preview Logo BARU (Local Blob) */}
                {preview && (
                    <div style={{ marginBottom: 15 }}>
                        <p style={{fontSize:'0.8rem', color:'#fbbf24', marginBottom: 5}}>Akan diganti menjadi:</p>
                        <img src={preview} alt="New Preview" style={{ width: 80, height: 80, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4, border: '2px solid #fbbf24' }} />
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