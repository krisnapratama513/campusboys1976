import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createVideo } from '../../../services/videoService';

const CreateVideo = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState(''); // Input URL (Link panjang)
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState('1'); // String '1' atau '0' untuk select

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await createVideo({
                title,
                url, // Kirim URL, backend yang akan ekstrak ID-nya
                description,
                is_active: parseInt(isActive)
            });
            alert("Video berhasil ditambahkan!");
            navigate('/dashboard/videos');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2>Tambah Video Youtube</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 20, borderRadius: 8, marginTop: 20 }}>
                
                <label style={{ display: 'block', marginBottom: 5 }}>Judul Video</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

                <label style={{ display: 'block', marginBottom: 5 }}>Link YouTube</label>
                <input 
                    type="text" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                    placeholder="Contoh: https://www.youtube.com/watch?v=xxxxx"
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
                        {isLoading ? 'Menyimpan...' : 'Simpan Video'}
                    </button>
                    <Link to="/dashboard/videos" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none' }}>Batal</Link>
                </div>
            </form>
        </div>
    );
};

export default CreateVideo;