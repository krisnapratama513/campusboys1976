// client/src/pages/admin/articles/CreateArticle.tsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createArticle } from '../../../services/articleService';
import { getAllAuthors } from '../../../services/authorService';

// --- 1. IMPORT REACT QUILL NEW ---
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import CSS bawaan

/**
 * Halaman Admin: Buat Artikel Baru.
 * Fitur:
 * - Upload Gambar dengan Preview.
 * - Rich Text Editor (Quill) untuk isi konten.
 * - Pilihan Author dan Status.
 * * @component
 */
const CreateArticle = () => {
    const navigate = useNavigate();
    
    // State Form Data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState(''); // Output: String HTML
    const [status, setStatus] = useState('publish');
    const [password, setPassword] = useState('');
    const [authorId, setAuthorId] = useState('');
    
    // State Gambar & Preview
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');

    // State Data Pendukung
    const [authors, setAuthors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Effect: Load data Author untuk dropdown
     */
    useEffect(() => {
        getAllAuthors().then(setAuthors).catch(err => console.error("Gagal load authors:", err));
    }, []);

    /**
     * Handle File Change & Preview
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setImageFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    // Cleanup memori preview
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // --- 2. CONFIG TOOLBAR QUILL ---
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }], // Header 1, Header 2, Normal
            ['bold', 'italic', 'underline', 'strike'], // Styling text
            [{ 'list': 'ordered'}, { 'list': 'bullet' }], // List angka & titik
            ['clean'] // Hapus format
        ],
    };

    /**
     * Submit Handler
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi Manual
        if (!authorId) {
            alert("Silakan pilih penulis terlebih dahulu!");
            return;
        }
        if (!content || content === '<p><br></p>') {
            alert("Konten artikel tidak boleh kosong!");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('content', content); 
            formData.append('status', status);
            formData.append('id_author', authorId);
            
            if (password) formData.append('password', password);
            if (imageFile) formData.append('img', imageFile); // Key 'img' sesuai backend

            await createArticle(formData);
            alert("Artikel berhasil dibuat!");
            navigate('/dashboard/articles');
        } catch (error: any) {
            alert(error.message || "Gagal membuat artikel");
        } finally {
            setIsLoading(false);
        }
    };

    // Styles
    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' };

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '24px' }}>Tulis Artikel Baru</h2>
            
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                
                {/* Judul */}
                <label style={labelStyle}>Judul Artikel</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} placeholder="Masukkan judul menarik..." />

                {/* Deskripsi Singkat */}
                <label style={labelStyle}>Deskripsi Singkat (Excerpt)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{...inputStyle, height: '80px'}} placeholder="Ringkasan untuk ditampilkan di kartu artikel..." />

                {/* Grid: Author & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Penulis</label>
                        <select value={authorId} onChange={e => setAuthorId(e.target.value)} required style={inputStyle}>
                            <option value="">-- Pilih Author --</option>
                            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Status Publikasi</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                            <option value="publish">Publish (Langsung Tayang)</option>
                            <option value="pending">Pending (Draft)</option>
                        </select>
                    </div>
                </div>

                {/* Gambar Utama */}
                <label style={labelStyle}>Gambar Utama (Cover)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />
                
                {/* Preview Gambar */}
                {preview && (
                    <div style={{ marginBottom: 20, textAlign: 'center', padding: 10, border: '1px dashed #475569', borderRadius: 6 }}>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 5 }}>Preview Cover:</p>
                        <img src={preview} alt="Preview" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 4 }} />
                    </div>
                )}

                {/* Password Protection */}
                <label style={labelStyle}>Password Proteksi (Opsional)</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Biarkan kosong jika artikel publik" style={inputStyle} />

                {/* Rich Text Editor */}
                <label style={labelStyle}>Konten Artikel Lengkap</label>
                
                {/* Wrapper div putih agar Editor terlihat jelas */}
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '6px', overflow: 'hidden', marginBottom: '25px' }}>
                    <ReactQuill 
                        theme="snow"
                        value={content}
                        onChange={setContent} 
                        modules={modules}
                        style={{ height: '350px', marginBottom: '50px' }} // Margin bottom extra untuk toolbar mobile/tampilan
                        placeholder="Mulai menulis cerita anda di sini..."
                    />
                </div>

                {/* Tombol Aksi */}
                <div style={{ display: 'flex', gap: 15, marginTop: 20 }}>
                    <button type="submit" disabled={isLoading} style={{ flex: 2, padding: '14px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                        {isLoading ? 'Sedang Menyimpan...' : 'Terbitkan Artikel'}
                    </button>
                    <Link to="/dashboard/articles" style={{ flex: 1, textAlign: 'center', padding: '14px', backgroundColor: '#334155', color: '#e2e8f0', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                        Batal
                    </Link>
                </div>

            </form>
        </div>
    );
};

export default CreateArticle;