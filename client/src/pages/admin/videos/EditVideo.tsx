// client/src/pages/admin/videos/EditVideo.tsx

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getVideoById, updateVideo } from '../../../services/videoService';

/**
 * Halaman Admin: Edit Video.
 * - Mengambil data lama.
 * - Menampilkan thumbnail dari link yang sedang diedit.
 * * @component
 */
const EditVideo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState('1');

    /**
     * Effect: Load Data Awal
     */
    useEffect(() => {
        if (id) {
            getVideoById(id)
                .then((data) => {
                    setTitle(data.title);
                    // UX: Ubah ID jadi URL lengkap agar admin paham
                    setUrl(`https://www.youtube.com/watch?v=${data.youtube_id}`);
                    setDescription(data.description || '');
                    setIsActive(String(data.is_active));
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("Load Error:", err);
                    alert("Gagal memuat data video");
                    navigate('/dashboard/videos');
                });
        }
    }, [id, navigate]);

    /**
     * Helper: Preview Thumbnail
     */
    const previewId = useMemo(() => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }, [url]);

    /**
     * Submit Handler
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!previewId) {
            alert("Link YouTube tidak valid!");
            return;
        }

        setIsLoading(true);

        try {
            await updateVideo(Number(id), {
                title,
                url, 
                description,
                is_active: parseInt(isActive)
            });
            alert("Video berhasil diperbarui!");
            navigate('/dashboard/videos');
        } catch (error: any) {
            alert(error.message);
            setIsLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' };

    if (isLoading) return <div style={{padding: 20, color:'#94a3b8'}}>Memuat data video...</div>;

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '20px' }}>Edit Video</h2>
            
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 24, borderRadius: 8, border: '1px solid #1e293b' }}>
                
                <label style={labelStyle}>Judul Video</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

                <label style={labelStyle}>Link YouTube</label>
                <input 
                    type="text" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                    placeholder="https://www.youtube.com/watch?v=..."
                    required 
                    style={inputStyle} 
                />

                {/* AREA PREVIEW */}
                {previewId && (
                    <div style={{ marginBottom: 20, textAlign: 'center' }}>
                         <label style={{...labelStyle, color: '#fbbf24', fontSize:'0.8rem'}}>Thumbnail Preview:</label>
                        <img 
                            src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`} 
                            alt="Preview" 
                            style={{ width: '100%', maxWidth: '250px', borderRadius: 6, border: '1px solid #475569' }}
                        />
                    </div>
                )}

                <label style={labelStyle}>Deskripsi</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} style={{...inputStyle, height: 80}} />

                <label style={labelStyle}>Status</label>
                <select value={isActive} onChange={e => setIsActive(e.target.value)} style={inputStyle}>
                    <option value="1">Active (Tampil)</option>
                    <option value="0">Draft (Sembunyi)</option>
                </select>

                <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
                    <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 12, backgroundColor: '#fbbf24', color: '#0f172a', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight:'bold' }}>
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <Link to="/dashboard/videos" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center', fontWeight: '500' }}>
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditVideo;