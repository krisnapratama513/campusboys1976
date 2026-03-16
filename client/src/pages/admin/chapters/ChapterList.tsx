// client/src/pages/admin/chapters/ChapterList.tsx

import { Link } from 'react-router-dom';
import { deleteChapter } from '../../../services/chapterService';
import { SERVER_ROOT } from '../../../config/api'; 
import { getErrorMessage } from '../../../utils/errorHandler';
import { useChapters } from '../../../hooks/useChapters';
import { ButtonLink } from '../components/ButtonLink/ButtonLink';
import StatusView from '../../../components/StatusView';
import { SafeImage } from '../../../components/SafeImage';

/**
 * @component ChapterList
 * @description Halaman Admin untuk manajemen data Chapter.
 * Menerapkan Separation of Concerns (SoC) dengan mendelegasikan 
 * logika data fetching ke custom hook `useChapters`.
 */
const ChapterList = () => {
    // Ekstraksi state reaktif dan fungsi refetch
    const { chapters, loading, error, removeChapterLocal } = useChapters();

    /**
     * Menangani aksi hapus chapter.
     * Menggunakan konfirmasi native untuk mencegah eksekusi tidak sengaja (UX/Security).
     * * @param {number} id - ID unik chapter
     * @param {string} name - Nama chapter untuk pesan konfirmasi
     */
    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Hapus chapter "${name}"?`)) return;

        try {
            await deleteChapter(id);
            // Sinkronisasi state: Memaksa update UI setelah mutasi data di server berhasil
            removeChapterLocal(id); 
        } catch (error) {
            alert(`Gagal: ${getErrorMessage(error)}`);
        }
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            {/* --- Header Section --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0px' }}>
                <h2>Manajemen Chapters</h2>
                <ButtonLink to="/dashboard/chapters/create">
                    + Tambah Chapter
                </ButtonLink>
            </div>

            {/* --- Table Section --- */}
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
                    {/* Status Indicators (Loading, Error, Empty).
                      Dibungkus <tr><td colSpan={4}> untuk mempertahankan integritas struktur DOM tabel.
                    */}
                    {loading && (
                        <tr><td colSpan={4} style={{ padding: 20 }}><StatusView message="Loading..." /></td></tr>
                    )}
                    
                    {error && (
                        <tr><td colSpan={4} style={{ padding: 20 }}><StatusView message={error} isError /></td></tr>
                    )}
                    
                    {!loading && !error && chapters.length === 0 && (
                        <tr><td colSpan={4} style={{ padding: 20 }}><StatusView message="Belum ada data." /></td></tr>
                    )}
                        
                    {/* Data Rendering */}
                    {!loading && !error && chapters.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: 15 }}>
                                <SafeImage
                                    src={`${SERVER_ROOT}/uploads/chapters/${item.img}`}
                                    alt={`Logo ${item.name}`}
                                    style={{ width: 50, height: 50, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4, padding: 2 }} // Gunakan prop style
                                />
                            </td>
                            <td style={{ padding: 15, fontWeight: 'bold' }}>{item.name}</td>
                            {/* Fallback string jika deskripsi null/kosong */}
                            <td style={{ padding: 15, color: '#94a3b8' }}>{item.description || '-'}</td>
                            <td style={{ padding: 15, textAlign: 'right' }}>
                                <Link 
                                    to={`/dashboard/chapters/edit/${item.id}`} 
                                    style={{ marginRight: 10, color: '#38bdf8' }}
                                >
                                    Edit
                                </Link>
                                <button 
                                    onClick={() => handleDelete(item.id, item.name)} 
                                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChapterList;