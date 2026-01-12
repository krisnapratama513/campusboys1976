// client/src/pages/admin/fanzines/CreateFanzine.tsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createFanzine } from '../../../services/fanzineService';
import { getAllAuthors } from '../../../services/authorService'; // Load Authors

const CreateFanzine = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default today YYYY-MM-DD
    const [authorId, setAuthorId] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    // Data
    const [authors, setAuthors] = useState<any[]>([]);

    useEffect(() => {
        getAllAuthors().then(setAuthors).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!coverFile || !pdfFile) {
            alert("Cover Image dan File PDF wajib diupload!");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('date', date);
            formData.append('author_id', authorId);
            formData.append('cover', coverFile);
            formData.append('pdf', pdfFile);

            await createFanzine(formData);
            alert("Fanzine berhasil dipublish!");
            navigate('/dashboard/fanzines');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' };

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '20px' }}>Upload Fanzine</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 24, borderRadius: 8, border: '1px solid #1e293b' }}>
                
                <label style={labelStyle}>Judul Edisi</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} placeholder="Misal: Edisi Mei 2024" />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                        <label style={labelStyle}>Tanggal Terbit</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Penulis / Editor</label>
                        <select value={authorId} onChange={e => setAuthorId(e.target.value)} required style={inputStyle}>
                            <option value="">-- Pilih Author --</option>
                            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                </div>

                <label style={labelStyle}>Cover Image (JPG/PNG)</label>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setCoverFile(e.target.files ? e.target.files[0] : null)} 
                    required 
                    style={inputStyle} 
                />

                <label style={labelStyle}>File PDF Fanzine</label>
                <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={e => setPdfFile(e.target.files ? e.target.files[0] : null)} 
                    required 
                    style={inputStyle} 
                />

                <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
                    <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 12, backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight:'bold' }}>
                        {isLoading ? 'Uploading...' : 'Publish Fanzine'}
                    </button>
                    <Link to="/dashboard/fanzines" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center' }}>Batal</Link>
                </div>
            </form>
        </div>
    );
};

export default CreateFanzine;