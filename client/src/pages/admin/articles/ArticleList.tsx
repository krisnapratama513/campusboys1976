// client/src/pages/admin/articles/ArticleList.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminArticles, deleteArticle } from '../../../services/articleService';
import type { FullArticleDetail } from '../../../types/article.types';
import { getErrorMessage } from '../../../utils/errorHandler';

/**
 * Halaman Admin: Manajemen Daftar Artikel.
 * Menampilkan tabel semua artikel (Publish/Draft) dengan fitur Hapus & Edit.
 * Menangani logika penghapusan artikel berpassword.
 * * @component
 */
const ArticleList = () => {
    // State Data
    const [articles, setArticles] = useState<FullArticleDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Fetch Data saat komponen di-mount.
     */
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        getAdminArticles()
            .then(data => setArticles(data))
            .catch(err => console.error("[ArticleList] Error:", err))
            .finally(() => setIsLoading(false));
    };

    /**
     * Handler Delete Artikel.
     * Logika:
     * 1. Cek apakah artikel memiliki password.
     * 2. Jika YA: Munculkan Prompt input password.
     * 3. Jika TIDAK: Munculkan Confirm dialog biasa.
     * 4. Panggil Service deleteArticle.
     */
    const handleDelete = async (id: number, title: string, hasPassword: boolean) => {
        let confirmPass = "";
        
        if (hasPassword) {
            // Case 1: Artikel Protected -> Minta Password
            const input = prompt(`PERINGATAN: Artikel "${title}" dilindungi password.\n\nMasukkan password artikel untuk menghapus:`);
            if (input === null) return; // User klik Cancel
            confirmPass = input;
        } else {
            // Case 2: Artikel Public -> Konfirmasi Biasa
            if (!window.confirm(`Yakin ingin menghapus artikel "${title}"?`)) return;
        }

        try {
            await deleteArticle(id, confirmPass);
            alert("Artikel berhasil dihapus!");
            fetchData(); // Refresh tabel
        } catch (error) {
            alert(`Gagal menghapus: ${getErrorMessage(error)}`);
        }
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2>Manajemen Artikel</h2>
                <Link to="/dashboard/articles/create" style={{ backgroundColor: '#38bdf8', color: '#0f172a', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight:'bold' }}>
                    + Tulis Artikel
                </Link>
            </div>

            {/* Table Section */}
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
                        {isLoading ? (
                            <tr><td colSpan={5} style={{padding:20, textAlign:'center'}}>Loading data...</td></tr>
                        ) : articles.length === 0 ? (
                            <tr><td colSpan={5} style={{padding:20, textAlign:'center'}}>Belum ada artikel.</td></tr>
                        ) : (
                            articles.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                                    {/* Kolom Status */}
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ 
                                            padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem',
                                            backgroundColor: item.status === 'publish' ? '#22c55e' : '#f59e0b',
                                            color: '#0f172a', fontWeight: 'bold', textTransform: 'uppercase'
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                    
                                    {/* Kolom Judul */}
                                    <td style={{ padding: '16px', fontWeight: '500' }}>{item.title}</td>
                                    
                                    {/* Kolom Author */}
                                    <td style={{ padding: '16px', color: '#94a3b8' }}>{item.author_name}</td>
                                    
                                    {/* Kolom Keamanan */}
                                    <td style={{ padding: '16px' }}>
                                        {item.password ? (
                                            <span style={{color: '#f43f5e', display:'flex', alignItems:'center', gap:5}}>
                                                🔒 Protected
                                            </span>
                                        ) : (
                                            <span style={{color: '#22c55e', display:'flex', alignItems:'center', gap:5}}>
                                                🔓 Public
                                            </span>
                                        )}
                                    </td>

                                    {/* Kolom Aksi */}
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <Link to={`/dashboard/articles/edit/${item.id}`} style={{ marginRight: '15px', color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(item.id, item.title, !!item.password)}
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

export default ArticleList;