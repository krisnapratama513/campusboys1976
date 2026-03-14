// client/src/pages/admin/chapters/ChapterList.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChapters, deleteChapter } from '../../../services/chapterService';
import { SERVER_ROOT } from '../../../config/api'; // Import Config URL
import type { Chapter } from '../../../types/chapter.types';
import { ButtonLink } from '../components/ButtonLink/ButtonLink';
import { getErrorMessage } from '../../../utils/errorHandler';

/**
 * Halaman Admin: Daftar Manajemen Chapters.
 * Menampilkan tabel semua chapter dengan fitur Hapus dan Link ke Edit.
 * * @component
 */
const ChapterList = () => {
    /** State data chapters */
    const [chapters, setChapters] = useState<Chapter[]>([]);
    /** State loading indicator */
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Mengambil data terbaru dari server.
     * Dipanggil saat mount dan setelah proses delete berhasil.
     */
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

    /**
     * Menangani penghapusan chapter.
     * Meminta konfirmasi browser sebelum memanggil API delete.
     * @param id ID Chapter
     * @param name Nama Chapter (untuk pesan konfirmasi)
     */
    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Hapus chapter "${name}"?`)) return;

        try {
            await deleteChapter(id);
            fetchData(); // Refresh tabel setelah hapus
        } catch (error) {
            alert("Gagal" + getErrorMessage(error));
        }
    };


    return (
        <div style={{ color: '#e2e8f0' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0px' }}>
                <h2>Manajemen Chapters</h2>

                <ButtonLink
                    to="/dashboard/chapters/create"
                    children="+ Tambah Chapter"
                />
            </div>

            {/* Table Section */}
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e293b' }}>
                    <thead style={{ backgroundColor: 'gray', color: '#94a3b8' }}>
                        <tr>
                            <th style={{ padding: 15, textAlign: 'left' }}>Logo</th>
                            <th style={{ padding: 15, textAlign: 'left' }}>Nama Chapter</th>
                            <th style={{ padding: 15, textAlign: 'left' }}>Deskripsi</th>
                            <th style={{ padding: 15, textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center' }}>Loading...</td></tr>
                        ) : chapters.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center' }}>Belum ada data.</td></tr>
                        ) : (
                            chapters.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: 15 }}>
                                        {/* UPDATE PATH GAMBAR DISINI */}
                                        <img
                                            src={`${SERVER_ROOT}/uploads/chapters/${item.img}`}
                                            alt={item.name}
                                            style={{ width: 50, height: 50, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4, padding: 2 }}
                                            // Fallback jika gambar error/hilang
                                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/50?text=Error')}
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