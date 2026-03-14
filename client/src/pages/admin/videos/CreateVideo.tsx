// client/src/pages/admin/videos/CreateVideo.tsx

import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createVideo } from '../../../services/videoService';
import { getErrorMessage } from '../../../utils/errorHandler';

/**
 * Halaman Admin: Tambah Video.
 * Fitur:
 * - Input Link YouTube (panjang).
 * - Real-time Preview Thumbnail sebelum simpan.
 * * @component
 */
const CreateVideo = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState('1'); 

    /**
     * Helper: Ekstrak ID untuk Preview di Frontend
     * (Backend tetap akan melakukan validasi ulang)
     */
    const previewId = useMemo(() => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }, [url]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!previewId) {
            alert("Link YouTube tidak valid! Pastikan thumbnail muncul.");
            return;
        }

        setIsLoading(true);

        try {
            await createVideo({
                title,
                url, // Kirim URL, backend yang akan ekstrak & simpan ID
                description,
                is_active: parseInt(isActive)
            });
            alert("Video berhasil ditambahkan!");
            navigate('/dashboard/videos');
        } catch (error) {
            alert("Gagal : " + getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' };

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '20px' }}>Tambah Video Youtube</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                
                {/* KOLOM KIRI: FORM */}
                <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 24, borderRadius: 8, border: '1px solid #1e293b', gridColumn: '1 / -1' }}>
                    
                    <label style={labelStyle}>Judul Video</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} placeholder="Judul video..." />

                    <label style={labelStyle}>Link YouTube</label>
                    <input 
                        type="text" 
                        value={url} 
                        onChange={e => setUrl(e.target.value)} 
                        placeholder="https://www.youtube.com/watch?v=..."
                        required 
                        style={inputStyle} 
                    />

                    {/* AREA PREVIEW THUMBNAIL */}
                    {url && (
                        <div style={{ marginBottom: 15, padding: 10, backgroundColor: '#1e293b', borderRadius: 6, border: '1px dashed #475569', textAlign: 'center' }}>
                            {previewId ? (
                                <>
                                    <p style={{ fontSize: '0.8rem', color: '#22c55e', margin: '0 0 10px 0' }}>Link Valid! Preview:</p>
                                    <img 
                                        src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`} 
                                        alt="Preview" 
                                        style={{ width: '100%', maxWidth: '200px', borderRadius: 4 }}
                                    />
                                </>
                            ) : (
                                <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: 0 }}>Link tidak dikenali atau format salah.</p>
                            )}
                        </div>
                    )}

                    <label style={labelStyle}>Deskripsi</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} style={{...inputStyle, height: 80}} placeholder="Keterangan singkat..." />

                    <label style={labelStyle}>Status Tayang</label>
                    <select value={isActive} onChange={e => setIsActive(e.target.value)} style={inputStyle}>
                        <option value="1">Active (Tampil di Galeri)</option>
                        <option value="0">Draft (Sembunyikan)</option>
                    </select>

                    <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
                        <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 12, backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight:'bold' }}>
                            {isLoading ? 'Menyimpan...' : 'Simpan Video'}
                        </button>
                        <Link to="/dashboard/videos" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center', fontWeight: '500' }}>
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateVideo;