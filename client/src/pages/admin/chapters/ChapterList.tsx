import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChapters, deleteChapter } from '../../../services/chapterService';
import type { Chapter } from '../../../types/chapter.types';

const ChapterList = () => {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = () => {
        setIsLoading(true);
        getChapters()
            .then(data => setChapters(data))
            .catch(err => alert(err.message))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Hapus chapter "${name}"?`)) return;

        try {
            await deleteChapter(id);
            fetchData();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2>Manajemen Chapters</h2>
                <Link to="/dashboard/chapters/create" style={{ backgroundColor: '#fbbf24', color: '#0f172a', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                    + Tambah Chapter
                </Link>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e293b' }}>
                <thead style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                    <tr>
                        <th style={{ padding: 15, textAlign: 'left' }}>Logo</th>
                        <th style={{ padding: 15, textAlign: 'left' }}>Nama Chapter</th>
                        <th style={{ padding: 15, textAlign: 'left' }}>Deskripsi</th>
                        <th style={{ padding: 15, textAlign: 'right' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr><td colSpan={4} style={{padding:20, textAlign:'center'}}>Loading...</td></tr>
                    ) : chapters.length === 0 ? (
                        <tr><td colSpan={4} style={{padding:20, textAlign:'center'}}>Belum ada data.</td></tr>
                    ) : (
                        chapters.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                                <td style={{ padding: 15 }}>
                                    <img 
                                        src={`/chapters/${item.img}`} 
                                        alt={item.name} 
                                        style={{ width: 50, height: 50, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4, padding: 2 }} 
                                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/50')}
                                    />
                                </td>
                                <td style={{ padding: 15, fontWeight: 'bold' }}>{item.name}</td>
                                <td style={{ padding: 15, color: '#94a3b8' }}>{item.description}</td>
                                <td style={{ padding: 15, textAlign: 'right' }}>
                                    <Link to={`/dashboard/chapters/edit/${item.id}`} style={{ marginRight: 10, color: '#38bdf8' }}>Edit</Link>
                                    <button onClick={() => handleDelete(item.id, item.name)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Hapus</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ChapterList;