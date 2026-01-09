import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getVideoById, updateVideo } from '../../../services/videoService';

const EditVideo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState('1');

    // 1. Load Data
    useEffect(() => {
        if (id) {
            getVideoById(id)
                .then((data) => {
                    setTitle(data.title);
                    // UX: Kembalikan ID menjadi format URL agar mudah dibaca admin
                    setUrl(`https://www.youtube.com/watch?v=${data.youtube_id}`);
                    setDescription(data.description || '');
                    setIsActive(String(data.is_active));
                    setIsLoading(false);
                })
                .catch((err) => {
                    alert("Gagal memuat data: " + err.message);
                    navigate('/dashboard/videos');
                });
        }
    }, [id, navigate]);

    // 2. Submit Update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateVideo(Number(id), {
                title,
                url, // Backend akan ekstrak ulang ID-nya dari sini
                description,
                is_active: parseInt(isActive)
            });
            alert("Video berhasil diupdate!");
            navigate('/dashboard/videos');
        } catch (error: any) {
            alert(error.message);
            setIsLoading(false); // Stop loading jika error agar bisa coba lagi
        }
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };

    if (isLoading) return <div style={{padding: 20, color:'white'}}>Memuat data video...</div>;

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2>Edit Video</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 20, borderRadius: 8, marginTop: 20 }}>
                
                <label style={{ display: 'block', marginBottom: 5 }}>Judul Video</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

                <label style={{ display: 'block', marginBottom: 5 }}>Link YouTube</label>
                <input 
                    type="text" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                    placeholder="https://www.youtube.com/watch?v=..."
                    required 
                    style={inputStyle} 
                />

                <label style={{ display: 'block', marginBottom: 5 }}>Deskripsi</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} style={{...inputStyle, height: 80}} />

                <label style={{ display: 'block', marginBottom: 5 }}>Status</label>
                <select value={isActive} onChange={e => setIsActive(e.target.value)} style={inputStyle}>
                    <option value="1">Active (Tampil)</option>
                    <option value="0">Draft (Sembunyi)</option>
                </select>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 12, backgroundColor: '#fbbf24', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight:'bold' }}>
                        {isLoading ? 'Menyimpan...' : 'Update Video'}
                    </button>
                    <Link to="/dashboard/videos" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center' }}>Batal</Link>
                </div>
            </form>
        </div>
    );
};

export default EditVideo;