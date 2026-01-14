// client/src/pages/admin/articles/EditArticle.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getArticleById, updateArticle } from '../../../services/articleService';
import { getAllAuthors } from '../../../services/authorService';

// Import Config untuk akses URL Server (Preview Gambar)
import { SERVER_ROOT } from '../../../config/api';

// Editor
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

/**
 * Halaman Admin: Edit Artikel.
 * Fitur:
 * - Load data artikel existing.
 * - Proteksi keamanan: Meminta 'confirm_password' jika artikel sebelumnya diproteksi.
 * - Upload gambar baru dengan preview lokal.
 * - Menampilkan gambar lama dari server.
 * * @component
 */
const EditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    
    // Form Data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('publish');
    
    // Password Logic
    const [password, setPassword] = useState(''); // Password Baru (Opsional)
    const [isProtected, setIsProtected] = useState(false); // Flag: Apakah artikel ini protected?
    const [confirmPassword, setConfirmPassword] = useState(''); // Password Lama (Wajib jika protected)
    
    // Author Data
    const [authorId, setAuthorId] = useState('');
    
    // Image Handling
    const [imageFile, setImageFile] = useState<File | null>(null); // File Baru
    const [preview, setPreview] = useState<string>(''); // Preview File Baru
    const [oldImage, setOldImage] = useState(''); // Nama File Lama (dari Server)

    // Data Pendukung
    const [authors, setAuthors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Effect: Load Data Awal (Authors & Detail Artikel)
     */
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch paralel agar lebih cepat
                const [authorsData, articleData] = await Promise.all([
                    getAllAuthors(),
                    getArticleById(id!)
                ]);

                setAuthors(authorsData);

                // Populate Form
                setTitle(articleData.title);
                setDescription(articleData.description);
                setContent(articleData.content);
                setStatus(articleData.status);
                setAuthorId(String(articleData.id_author));
                setOldImage(articleData.img);
                
                // Logic cek proteksi
                // Jika field password ada isinya, set flag true
                if (articleData.password && articleData.password !== "") {
                    setIsProtected(true);
                }

            } catch (error) {
                console.error("Load Data Error:", error);
                alert("Gagal memuat data artikel");
                navigate('/dashboard/articles');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) loadInitialData();
    }, [id, navigate]);

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

    // Config Toolbar Quill
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
        ],
    };

    /**
     * Submit Handler
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Security Check: Wajib isi password lama jika artikel protected
        if (isProtected && !confirmPassword) {
            alert("Artikel ini dilindungi password.\nMasukkan password lama di kolom 'Konfirmasi Password' untuk menyimpan perubahan.");
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
            
            // Password Baru (Hanya kirim jika user ingin ganti)
            if (password) formData.append('password', password);
            
            // Confirm Password (Untuk otentikasi di backend)
            if (isProtected) formData.append('confirm_password', confirmPassword);

            // Gambar (Hanya kirim jika user upload baru)
            if (imageFile) formData.append('img', imageFile);

            await updateArticle(id!, formData);
            alert("Artikel berhasil diperbarui!");
            navigate('/dashboard/articles');

        } catch (error: any) {
            alert(error.message || "Gagal update artikel"); 
        } finally {
            setIsLoading(false);
        }
    };

    // Styles
    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' };

    if (isLoading) return <div style={{color:'white', padding: 20}}>Loading data...</div>;

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '24px' }}>Edit Artikel</h2>
            
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                
                {/* Judul & Deskripsi */}
                <label style={labelStyle}>Judul Artikel</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

                <label style={labelStyle}>Deskripsi Singkat</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{...inputStyle, height: '80px'}} />

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
                        <label style={labelStyle}>Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                            <option value="publish">Publish</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* --- IMAGE SECTION --- */}
                <label style={labelStyle}>Gambar Utama</label>

                {/* Tampilan Gambar Lama (Jika ada dan user belum upload baru) */}
                {!preview && oldImage && (
                    <div style={{ marginBottom: 15, display:'flex', alignItems:'center', gap: 15, padding: 10, border: '1px dashed #475569', borderRadius: 6 }}>
                        <img 
                            src={`${SERVER_ROOT}/uploads/articles/${oldImage}`} 
                            alt="Current Cover" 
                            style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} 
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/80?text=Error')}
                        />
                        <div>
                            <span style={{fontSize:'0.85rem', color:'#94a3b8', display:'block'}}>Cover saat ini</span>
                            <span style={{fontSize:'0.75rem', color:'#64748b'}}>{oldImage}</span>
                        </div>
                    </div>
                )}

                <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />

                {/* Preview Gambar Baru */}
                {preview && (
                    <div style={{ marginBottom: 20, textAlign: 'center', padding: 10, border: '1px dashed #fbbf24', borderRadius: 6 }}>
                        <p style={{ fontSize: '0.8rem', color: '#fbbf24', marginBottom: 5 }}>Akan diganti menjadi:</p>
                        <img src={preview} alt="New Preview" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 4 }} />
                    </div>
                )}

                {/* --- SECURITY SECTION --- */}
                <div style={{ border: '1px solid #334155', padding: '20px', borderRadius: '6px', marginBottom: '25px', backgroundColor: '#1e293b' }}>
                    <h4 style={{marginTop:0, color:'#fbbf24', display:'flex', alignItems:'center', gap:8}}>
                        🔐 Pengaturan Keamanan
                    </h4>
                    
                    <label style={labelStyle}>Set Password Baru (Opsional)</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="Isi HANYA jika ingin mengganti password lama" 
                        style={inputStyle} 
                    />

                    {/* Form Konfirmasi (Hanya Muncul Jika Artikel Protected) */}
                    {isProtected && (
                        <div style={{marginTop: 15, padding: 15, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 6, border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                            <label style={{...labelStyle, color: '#ef4444', fontWeight:'bold', display:'flex', alignItems:'center', gap:5}}>
                                ⚠️ Verifikasi Diperlukan
                            </label>
                            <p style={{fontSize:'0.85rem', color:'#cbd5e1', marginTop:0, marginBottom:10}}>
                                Artikel ini terkunci. Masukkan password lama untuk menyimpan perubahan apapun.
                            </p>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)} 
                                required
                                placeholder="Masukkan password lama..." 
                                style={{...inputStyle, border: '1px solid #ef4444', marginBottom: 0}} 
                            />
                        </div>
                    )}
                </div>

                {/* Rich Text Editor */}
                <label style={labelStyle}>Konten Artikel</label>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '6px', overflow: 'hidden', marginBottom: '25px' }}>
                    <ReactQuill 
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        style={{ height: '350px', marginBottom: '50px' }}
                    />
                </div>

                {/* Action Buttons */}
                <div style={{display:'flex', gap: 15}}>
                    <button type="submit" disabled={isLoading} style={{ flex: 2, padding: '14px', backgroundColor: '#fbbf24', color: '#0f172a', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize:'1rem' }}>
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <Link to="/dashboard/articles" style={{ flex: 1, textAlign:'center', padding: '14px', backgroundColor: '#334155', color: '#e2e8f0', textDecoration: 'none', borderRadius: '6px', fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditArticle;