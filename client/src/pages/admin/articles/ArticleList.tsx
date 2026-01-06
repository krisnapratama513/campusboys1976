import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminArticles, deleteArticle } from '../../../services/articleService';
import type { FullArticleDetail } from '../../../types/article.types';

const ArticleList = () => {
    const [articles, setArticles] = useState<FullArticleDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        getAdminArticles()
            .then(data => setArticles(data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    const handleDelete = async (id: number, title: string, hasPassword: boolean) => {
        let confirmPass = "";
        
        // Jika artikel punya password (field password terisi di DB), minta input user
        // Note: Di frontend kita tidak tau password aslinya, tapi kita tau field itu tidak kosong string
        if (hasPassword) {
            const input = prompt(`Artikel "${title}" dilindungi password.\nMasukkan password untuk menghapus:`);
            if (input === null) return; // Cancel
            confirmPass = input;
        } else {
            if (!window.confirm(`Hapus artikel "${title}"?`)) return;
        }

        try {
            await deleteArticle(id, confirmPass);
            alert("Artikel berhasil dihapus!");
            fetchData();
        } catch (error: any) {
            alert(error.message); // Tampilkan pesan error (misal: Password salah)
        }
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2>Manajemen Artikel</h2>
                <Link to="/dashboard/articles/create" style={{ backgroundColor: '#38bdf8', color: '#0f172a', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight:'bold' }}>
                    + Tulis Artikel
                </Link>
            </div>

            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                        <tr>
                            <th style={{ padding: '16px' }}>Status</th>
                            <th style={{ padding: '16px' }}>Judul</th>
                            <th style={{ padding: '16px' }}>Author</th>
                            <th style={{ padding: '16px' }}>Keamanan</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={5} style={{padding:20, textAlign:'center'}}>Loading...</td></tr> : 
                        articles.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem',
                                        backgroundColor: item.status === 'publish' ? '#22c55e' : '#f59e0b',
                                        color: '#0f172a', fontWeight: 'bold'
                                    }}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>{item.title}</td>
                                <td style={{ padding: '16px', color: '#94a3b8' }}>{item.author_name}</td>
                                <td style={{ padding: '16px' }}>
                                    {item.password ? '🔒 Password' : '🔓 Public'}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <Link to={`/dashboard/articles/edit/${item.id}`} style={{ marginRight: '10px', color: '#38bdf8', textDecoration: 'none' }}>Edit</Link>
                                    <button 
                                        onClick={() => handleDelete(item.id, item.title, !!item.password)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ArticleList;