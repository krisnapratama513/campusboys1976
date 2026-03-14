// client/src/pages/admin/authors/AuthorList.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAuthors, deleteAuthor, type Author } from '../../../services/authorService';
import { ButtonLink } from '../components/ButtonLink/ButtonLink';
import { getErrorMessage } from '../../../utils/errorHandler';

/**
 * Halaman Admin: Daftar Author.
 * Menampilkan tabel penulis beserta statistik jumlah karya (Artikel & Fanzine).
 * Menyediakan aksi Edit dan Hapus.
 * * @component
 */
const AuthorList = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data saat mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getAllAuthors();
            setAuthors(data);
        } catch (error) {
            console.error("[AuthorList] Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle Delete Author
     * Menampilkan konfirmasi dan alert hasil operasi.
     */
    const handleDelete = async (id: number, name: string) => {
        const confirm = window.confirm(`Yakin ingin menghapus author "${name}"?`);
        if (!confirm) return;

        try {
            await deleteAuthor(id);
            alert("Author berhasil dihapus!");
            fetchData(); // Refresh list
        } catch (error) {
            alert("Gagal" + getErrorMessage(error));
        }
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            {/* --- HEADER --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manajemen Authors</h2>

                <ButtonLink to="/dashboard/authors/create" children="+ Tambah Author" />
            </div>

            {/* --- TABLE --- */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#334155', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                        <tr>
                            <th style={{ padding: '16px', width: '80px' }}>ID</th>
                            <th style={{ padding: '16px' }}>Nama Author</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Artikel</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Fanzine</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Memuat data...</td>
                            </tr>
                        ) : authors.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Belum ada data author.</td>
                            </tr>
                        ) : (
                            authors.map((author) => (
                                <tr key={author.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: '16px', color: '#64748b' }}>#{author.id}</td>
                                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{author.name}</td>

                                    {/* Stats: Artikel */}
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <span style={{ backgroundColor: '#0f172a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#38bdf8', border: '1px solid #1e293b' }}>
                                            {author.total_articles}
                                        </span>
                                    </td>

                                    {/* Stats: Fanzine */}
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <span style={{ backgroundColor: '#0f172a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#fbbf24', border: '1px solid #1e293b' }}>
                                            {author.total_fanzine}
                                        </span>
                                    </td>

                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <Link
                                            to={`/dashboard/authors/edit/${author.id}`}
                                            style={{
                                                marginRight: '15px',
                                                color: '#38bdf8',
                                                textDecoration: 'none',
                                                fontWeight: 'bold',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(author.id, author.name)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
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

export default AuthorList;