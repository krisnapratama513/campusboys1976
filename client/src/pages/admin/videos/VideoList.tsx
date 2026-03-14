// client/src/pages/admin/videos/VideoList.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminVideos, deleteVideo } from '../../../services/videoService';
import type { Video } from '../../../types/video.types';
import { getErrorMessage } from '../../../utils/errorHandler';

/**
 * Halaman Admin: Manajemen Video (YouTube Gallery).
 * * @component
 */
const VideoList = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = () => {
        setIsLoading(true);
        getAdminVideos()
            .then(res => setVideos(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number, title: string) => {
        if(!window.confirm(`Yakin ingin menghapus video "${title}"?`)) return;
        try {
            await deleteVideo(id);
            alert("Video berhasil dihapus");
            fetchData();
        } catch (error) {
            alert("Video Gagal dihapus" + getErrorMessage(error));
        }
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2>Manajemen Video</h2>
                <Link to="/dashboard/videos/create" style={{ backgroundColor: '#fbbf24', color: '#0f172a', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                    + Tambah Video
                </Link>
            </div>

            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: 15, textAlign: 'left' }}>Thumbnail</th>
                            <th style={{ padding: 15, textAlign: 'left' }}>Judul</th>
                            <th style={{ padding: 15, textAlign: 'left' }}>ID Youtube</th>
                            <th style={{ padding: 15, textAlign: 'center' }}>Status</th>
                            <th style={{ padding: 15, textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center' }}>Loading...</td></tr>
                        ) : videos.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>Belum ada video.</td></tr>
                        ) : (
                            videos.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: 15 }}>
                                        {/* Auto Thumbnail dari YouTube (Medium Quality) */}
                                        <div style={{width: 100, height: 60, overflow:'hidden', borderRadius: 4, border: '1px solid #475569'}}>
                                            <img 
                                                src={`https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`} 
                                                alt="thumb" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x60?text=No+Img')}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ padding: 15, fontWeight:'bold' }}>{item.title}</td>
                                    <td style={{ padding: 15 }}>
                                        <span style={{ fontFamily:'monospace', color:'#fbbf24', backgroundColor:'rgba(251, 191, 36, 0.1)', padding:'2px 6px', borderRadius:4 }}>
                                            {item.youtube_id}
                                        </span>
                                    </td>
                                    <td style={{ padding: 15, textAlign:'center' }}>
                                        {item.is_active === 1 ? (
                                            <span style={{color: '#22c55e', fontWeight:'bold', fontSize:'0.8rem', border:'1px solid #22c55e', padding:'2px 8px', borderRadius:20}}>ACTIVE</span>
                                        ) : (
                                            <span style={{color: '#94a3b8', fontSize:'0.8rem', border:'1px solid #94a3b8', padding:'2px 8px', borderRadius:20}}>HIDDEN</span>
                                        )}
                                    </td>
                                    <td style={{ padding: 15, textAlign: 'right' }}>
                                        <Link to={`/dashboard/videos/edit/${item.id}`} style={{ marginRight: 15, color: '#38bdf8', textDecoration: 'none', fontWeight:'bold' }}>Edit</Link>
                                        <button onClick={() => handleDelete(item.id, item.title)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight:'bold' }}>Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VideoList;