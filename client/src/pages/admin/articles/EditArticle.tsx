import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getArticleById, updateArticle } from '../../../services/articleService'; // Pastikan service updateArticle sudah ada
import { getAllAuthors } from '../../../services/authorService';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const EditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State Form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('publish');
    
    // Password Baru (jika ingin ganti)
    const [password, setPassword] = useState('');
    
    // Author
    const [authorId, setAuthorId] = useState('');
    
    // Image
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [oldImage, setOldImage] = useState('');

    // Security State
    const [isProtected, setIsProtected] = useState(false); // Cek apakah artikel ini ber-password
    const [confirmPassword, setConfirmPassword] = useState(''); // Input wajib jika isProtected = true

    // Data Pendukung
    const [authors, setAuthors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. LOAD DATA SAAT MEMBUKA HALAMAN
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [authorsData, articleData] = await Promise.all([
                    getAllAuthors(),
                    getArticleById(id!)
                ]);

                setAuthors(authorsData);

                // Isi Form dengan Data Lama
                setTitle(articleData.title);
                setDescription(articleData.description);
                setContent(articleData.content); // HTML string masuk ke Quill
                setStatus(articleData.status);
                setAuthorId(String(articleData.id_author));
                setOldImage(articleData.img);
                
                // Cek apakah ada password (backend biasanya kirim string kosong/null jika tidak ada, atau field password terisi)
                // Di tipe data frontend kita tadi: password?: string
                if (articleData.password && articleData.password !== "") {
                    setIsProtected(true);
                }

            } catch (error) {
                alert("Gagal memuat data artikel");
                navigate('/dashboard/articles');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [id, navigate]);

    // 2. CONFIG QUILL
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
        ],
    };

    // 3. SUBMIT UPDATE
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi Password Lama (Jika artikel diproteksi)
        if (isProtected && !confirmPassword) {
            alert("Artikel ini dilindungi password. Masukkan password lama untuk menyimpan perubahan.");
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
            
            // Password Baru (Hanya kirim jika user mengisi/ingin mengganti)
            if (password) formData.append('password', password);
            
            // Confirm Password (Wajib untuk verifikasi backend)
            if (isProtected) formData.append('confirm_password', confirmPassword);

            // Gambar (Hanya kirim jika user upload baru)
            if (imageFile) formData.append('img', imageFile);

            await updateArticle(id!, formData);
            alert("Artikel berhasil diupdate!");
            navigate('/dashboard/articles');

        } catch (error: any) {
            alert(error.message); // Tampilkan error dari backend (misal: Password Salah)
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#94a3b8' };

    if (isLoading) return <div style={{color:'white', padding: 20}}>Loading data...</div>;

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '20px' }}>Edit Artikel</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '8px' }}>
                
                <label style={labelStyle}>Judul</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

                <label style={labelStyle}>Deskripsi Singkat</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{...inputStyle, height: '60px'}} />

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

                <label style={labelStyle}>Ganti Gambar (Opsional)</label>
                {oldImage && <div style={{fontSize:'0.8rem', color:'#fbbf24', marginBottom:5}}>Gambar saat ini: {oldImage}</div>}
                <input type="file" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} style={inputStyle} />

                {/* LOGIKA PASSWORD */}
                <div style={{ border: '1px solid #334155', padding: '15px', borderRadius: '6px', marginBottom: '20px', backgroundColor: '#1e293b' }}>
                    <h4 style={{marginTop:0, color:'#fbbf24'}}>Keamanan</h4>
                    
                    <label style={labelStyle}>Set Password Baru (Opsional)</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="Isi jika ingin MENGGANTI password" 
                        style={inputStyle} 
                    />

                    {/* Jika artikel punya password, form ini WAJIB muncul */}
                    {isProtected && (
                        <div style={{marginTop: 10}}>
                            <label style={{...labelStyle, color: '#ef4444', fontWeight:'bold'}}>
                                * Konfirmasi Password Lama (Wajib)
                            </label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)} 
                                required
                                placeholder="Masukkan password lama untuk menyimpan" 
                                style={{...inputStyle, border: '1px solid #ef4444'}} 
                            />
                        </div>
                    )}
                </div>

                <label style={labelStyle}>Konten Artikel</label>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
                    <ReactQuill 
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        style={{ height: '300px', marginBottom: '40px' }}
                    />
                </div>

                <div style={{display:'flex', gap: 10}}>
                    <button type="submit" style={{ flex:1, padding: '12px', backgroundColor: '#fbbf24', color: '#0f172a', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                        Update Artikel
                    </button>
                    <Link to="/dashboard/articles" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center'}}>
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditArticle;