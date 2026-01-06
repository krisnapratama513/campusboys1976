// client/src/pages/admin/articles/CreateArticle.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../../../services/articleService';
import { getAllAuthors } from '../../../services/authorService';

// --- 1. IMPORT REACT QUILL NEW ---
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import CSS bawaan

const CreateArticle = () => {
    const navigate = useNavigate();
    
    // State Form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState(''); // Isinya nanti string HTML
    const [status, setStatus] = useState('publish');
    const [password, setPassword] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [authors, setAuthors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load Authors
    useEffect(() => {
        getAllAuthors().then(setAuthors).catch(console.error);
    }, []);

    // --- 2. CONFIG TOOLBAR QUILL ---
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }], // Header 1, Header 2, Normal
            ['bold', 'italic', 'underline', 'strike'], // Styling text
            [{ 'list': 'ordered'}, { 'list': 'bullet' }], // List angka & titik
            ['clean'] // Hapus format
        ],
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('content', content); // Content sudah berbentuk HTML
            formData.append('status', status);
            formData.append('id_author', authorId);
            if (password) formData.append('password', password);
            if (imageFile) formData.append('img', imageFile);

            await createArticle(formData);
            alert("Artikel berhasil dibuat!");
            navigate('/dashboard/articles');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Styling helpers
    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#94a3b8' };

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '20px' }}>Tulis Artikel Baru</h2>
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
                            <option value="publish">Publish (Tayang)</option>
                            <option value="pending">Pending (Draft)</option>
                        </select>
                    </div>
                </div>

                <label style={labelStyle}>Gambar Utama</label>
                <input type="file" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} style={inputStyle} />

                <label style={labelStyle}>Password (Opsional)</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Kosongkan jika publik" style={inputStyle} />

                <label style={labelStyle}>Konten Artikel</label>
                
                {/* --- 3. EDITOR REACT QUILL --- */}
                {/* Dibungkus div putih agar terlihat jelas di tema gelap */}
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
                    <ReactQuill 
                        theme="snow"
                        value={content}
                        onChange={setContent} // Quill langsung melempar value string
                        modules={modules}
                        style={{ height: '300px', marginBottom: '40px' }} // Margin bottom extra untuk toolbar mobile
                    />
                </div>

                <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                    {isLoading ? 'Menyimpan...' : 'Terbitkan Artikel'}
                </button>
            </form>
        </div>
    );
};

export default CreateArticle;