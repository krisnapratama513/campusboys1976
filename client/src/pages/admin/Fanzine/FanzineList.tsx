// client/src/pages/admin/fanzines/FanzineList.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllFanzine, deleteFanzine } from '../../../services/fanzineService';
import type { FanzineType } from '../../../types/fanzine.types';

const FanzineList = () => {
    const [fanzines, setFanzines] = useState<FanzineType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        getAllFanzine()
            .then(data => setFanzines(data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`Hapus fanzine "${title}"?`)) return;

        try {
            await deleteFanzine(id);
            alert("Fanzine berhasil dihapus!");
            fetchData(); // Refresh tabel
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Daftar Fanzines</h2>
                <Link
                    to="/dashboard/fanzines/create"
                    style={{
                        backgroundColor: '#38bdf8', color: '#0f172a',
                        padding: '10px 20px', borderRadius: '6px',
                        textDecoration: 'none', fontWeight: 'bold'
                    }}
                >
                    + Upload Fanzine
                </Link>
            </div>

            {/* Tabel */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#334155', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                        <tr>
                            <th style={{ padding: '16px' }}>Cover</th>
                            <th style={{ padding: '16px' }}>Judul</th>
                            <th style={{ padding: '16px' }}>Author</th>
                            <th style={{ padding: '16px' }}>Tanggal</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center' }}>Memuat...</td></tr>
                        ) : fanzines.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center' }}>Belum ada data.</td></tr>
                        ) : (
                            fanzines.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: '16px' }}>
                                        {/* Thumbnail Gambar Kecil */}
                                        {item.imgFilename && (
                                            <img
                                                src={`/magazine/cover/${item.imgFilename}`}
                                                alt="cover"
                                                style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        )}
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: '500' }}>{item.title}</td>
                                    <td style={{ padding: '16px', color: '#94a3b8' }}>{item.author_name}</td>
                                    <td style={{ padding: '16px', color: '#94a3b8' }}>
                                        {new Date(item.date).toLocaleDateString('id-ID')}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <Link
                                            to={`/dashboard/fanzines/edit/${item.id}`}
                                            style={{ marginRight: '10px', color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id, item.title)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
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

export default FanzineList;