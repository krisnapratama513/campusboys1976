// client/src/pages/admin/authors/AuthorList.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { API_BASE_URL } from '../../../config/api';

import { getAllAuthors, deleteAuthor } from '../../../services/authorService';
import type { Author } from '../../../services/authorService';

// Definisikan tipe data Author biar TypeScript senang
// interface Author {
//     id: number;
//     name: string;
//     total_articles: number;
//     total_fanzine: number;
// }

const AuthorList = () => {

    const [authors, setAuthors] = useState<Author[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Kode jadi lebih ringkas
            const data = await getAllAuthors();
            setAuthors(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleDelete = async (id: number, name: string) => {
        const confirm = window.confirm(`Hapus author "${name}"?`);
        if (!confirm) return;

        try {
            // Panggil service delete
            await deleteAuthor(id);
            alert("Berhasil dihapus!");
            fetchData();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            {/* --- HEADER HALAMAN --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Daftar Authors</h2>

                {/* Tombol Tambah (Mengarah ke route create) */}
                <Link
                    to="/dashboard/authors/create"
                    style={{
                        backgroundColor: '#38bdf8',
                        color: '#0f172a',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}
                >
                    + Tambah Author
                </Link>
            </div>

            {/* --- TABEL DATA --- */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#334155', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                        <tr>
                            <th style={{ padding: '16px', width: '80px' }}>ID</th>
                            <th style={{ padding: '16px' }}>Nama Author</th>
                            {/* --- DUA KOLOM BARU --- */}
                            <th style={{ padding: '16px', textAlign: 'center' }}>Artikel</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Fanzine</th>
                            {/* ---------------------- */}
                            <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    {/* CARI BAGIAN <tbody> DAN GANTI MENJADI: */}
                    <tbody>
                        {isLoading ? (
                            <tr>
                                {/* UBAH colSpan JADI 5 */}
                                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Memuat data...</td>
                            </tr>
                        ) : authors.length === 0 ? (
                            <tr>
                                {/* UBAH colSpan JADI 5 */}
                                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Belum ada data author.</td>
                            </tr>
                        ) : (
                            authors.map((author) => (
                                <tr key={author.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: '16px' }}>#{author.id}</td>
                                    <td style={{ padding: '16px', fontWeight: '500' }}>{author.name}</td>

                                    {/* --- TAMPILKAN TOTAL ARTIKEL --- */}
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <span style={{ backgroundColor: '#334155', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', color: '#38bdf8' }}>
                                            {author.total_articles}
                                        </span>
                                    </td>

                                    {/* --- TAMPILKAN TOTAL FANZINE --- */}
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <span style={{ backgroundColor: '#334155', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', color: '#fbbf24' }}>
                                            {author.total_fanzine}
                                        </span>
                                    </td>

                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <Link
                                            to={`/dashboard/authors/edit/${author.id}`}
                                            style={{
                                                marginRight: '10px',
                                                color: '#38bdf8',
                                                textDecoration: 'none',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(author.id, author.name)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
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