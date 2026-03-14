// client/src/pages/admin/albums/AlbumList.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminAlbums, deleteAlbum } from '../../../services/albumService';
import type { Album } from '../../../types/album.types';
import { SERVER_ROOT } from '../../../config/api'; // [1] Import Config
import { getErrorMessage } from '../../../utils/errorHandler';

// Helper format tanggal
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
};

const AlbumList = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = () => {
        setIsLoading(true);
        getAdminAlbums()
            .then(data => setAlbums(data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`Hapus album "${title}" beserta seluruh fotonya?`)) return;

        try {
            await deleteAlbum(id);
            alert("Album berhasil dihapus");
            fetchData();
        } catch (error) {
            alert("Gagal : " + getErrorMessage(error));
        }
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2>Galeri Album</h2>
                <Link to="/dashboard/albums/create" style={{ backgroundColor: '#38bdf8', color: '#0f172a', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                    + Buat Album Baru
                </Link>
            </div>

            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                        <tr>
                            <th style={{ padding: '16px' }}>Cover</th>
                            <th style={{ padding: '16px' }}>Judul Album</th>
                            <th style={{ padding: '16px' }}>Tanggal Event</th>
                            <th style={{ padding: '16px' }}>Status</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center' }}>Loading...</td></tr>
                        ) : albums.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>Belum ada album.</td></tr>
                        ) : (
                            albums.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: '16px' }}>
                                        {/* [3] GUNAKAN URL SERVER */}
                                        <img 
                                            src={`${SERVER_ROOT}/uploads/albums/covers/${item.image}`} 
                                            alt="Cover" 
                                            style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', backgroundColor:'#0f172a' }} 
                                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/60x40?text=No+Img')}
                                        />
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{fontWeight:'bold'}}>{item.title}</div>
                                        <div style={{fontSize:'0.8rem', color:'#94a3b8'}}>{item.description?.substring(0, 50)}...</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{formatDate(item.date)}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ 
                                            padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem',
                                            backgroundColor: item.status === 'publish' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)', // Transparan dikit biar bagus
                                            color: item.status === 'publish' ? '#4ade80' : '#fbbf24', 
                                            fontWeight: 'bold', border: item.status === 'publish' ? '1px solid #22c55e' : '1px solid #f59e0b'
                                        }}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <Link to={`/dashboard/albums/edit/${item.id}`} style={{ marginRight: '15px', color: '#38bdf8', textDecoration: 'none', fontWeight:'bold' }}>Edit</Link>
                                        <button 
                                            onClick={() => handleDelete(item.id, item.title)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight:'bold' }}
                                        >
                                            Hapus
                                        </button>
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

export default AlbumList;