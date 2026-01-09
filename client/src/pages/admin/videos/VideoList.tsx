import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminVideos, deleteVideo } from '../../../services/videoService';
import type { Video } from '../../../types/video.types';

const VideoList = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = () => {
        setIsLoading(true);
        getAdminVideos()
            .then(res => setVideos(res.data))
            .catch(err => alert(err.message))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number, title: string) => {
        if(!window.confirm(`Hapus video "${title}"?`)) return;
        try {
            await deleteVideo(id);
            fetchData();
        } catch (error: any) {
            alert(error.message);
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

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e293b' }}>
                <thead style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                    <tr>
                        <th style={{ padding: 15, textAlign: 'left' }}>Thumbnail</th>
                        <th style={{ padding: 15, textAlign: 'left' }}>Judul</th>
                        <th style={{ padding: 15, textAlign: 'left' }}>ID Youtube</th>
                        <th style={{ padding: 15, textAlign: 'left' }}>Status</th>
                        <th style={{ padding: 15, textAlign: 'right' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: 15 }}>
                                {/* Auto Thumbnail dari YouTube */}
                                <img 
                                    src={`https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`} 
                                    alt="thumb" 
                                    style={{ width: 80, borderRadius: 4 }}
                                />
                            </td>
                            <td style={{ padding: 15 }}>
                                <div style={{fontWeight:'bold'}}>{item.title}</div>
                            </td>
                            <td style={{ padding: 15, fontFamily:'monospace', color:'#fbbf24' }}>
                                {item.youtube_id}
                            </td>
                            <td style={{ padding: 15 }}>
                                {item.is_active === 1 ? (
                                    <span style={{color: '#22c55e', fontWeight:'bold'}}>Active</span>
                                ) : (
                                    <span style={{color: '#ef4444'}}>Draft</span>
                                )}
                            </td>
                            <td style={{ padding: 15, textAlign: 'right' }}>
                                {/* Edit belum dibuat, tapi linknya disiapkan */}
                                <Link to={`/dashboard/videos/edit/${item.id}`} style={{ marginRight: 10, color: '#38bdf8' }}>Edit</Link>
                                <button onClick={() => handleDelete(item.id, item.title)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VideoList;