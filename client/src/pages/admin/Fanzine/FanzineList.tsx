// client/src/pages/admin/fanzines/FanzineList.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllFanzine, deleteFanzine } from '../../../services/fanzineService';
import type { FanzineType } from '../../../types/fanzine.types';
import { SERVER_ROOT } from '../../../config/api';

const FanzineList = () => {
    const [fanzines, setFanzines] = useState<FanzineType[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    const fetchData = () => {
        setIsLoading(true);
        getAllFanzine()
            .then(data => setFanzines(data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`Hapus fanzine "${title}" beserta filenya?`)) return;
        try {
            await deleteFanzine(id);
            alert("Fanzine berhasil dihapus!");
            fetchData();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2>Manajemen Fanzine</h2>
                <Link to="/dashboard/fanzines/create" style={{ backgroundColor: '#fbbf24', color: '#0f172a', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                    + Upload Fanzine
                </Link>
            </div>

            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: 15, textAlign: 'left' }}>Cover</th>
                            <th style={{ padding: 15, textAlign: 'left' }}>Judul</th>
                            <th style={{ padding: 15, textAlign: 'left' }}>Penulis</th>
                            <th style={{ padding: 15, textAlign: 'center' }}>Tanggal</th>
                            <th style={{ padding: 15, textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center' }}>Loading...</td></tr>
                        ) : fanzines.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>Belum ada fanzine.</td></tr>
                        ) : (
                            fanzines.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: 15 }}>
                                        <img 
                                            src={`${SERVER_ROOT}/uploads/fanzines/covers/${item.imgFilename}`} 
                                            alt="cover" 
                                            style={{ width: 50, height: 70, objectFit: 'cover', borderRadius: 4, backgroundColor: '#334155' }}
                                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x70?text=No+Img')}
                                        />
                                    </td>
                                    <td style={{ padding: 15, fontWeight: 'bold' }}>
                                        {item.title}
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal', marginTop: 4 }}>
                                            PDF: {item.pdfFilename}
                                        </div>
                                    </td>
                                    <td style={{ padding: 15 }}>{item.author_name}</td>
                                    <td style={{ padding: 15, textAlign: 'center' }}>
                                        {new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td style={{ padding: 15, textAlign: 'right' }}>
                                        <Link to={`/dashboard/fanzines/edit/${item.id}`} style={{ marginRight: 15, color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>Edit</Link>
                                        <button onClick={() => handleDelete(item.id, item.title)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Hapus</button>
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