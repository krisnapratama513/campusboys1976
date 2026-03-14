import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getFanzineById, updateFanzine } from '../../../services/fanzineService';
import { getAllAuthors, type Author } from '../../../services/authorService';
import { getErrorMessage } from '../../../utils/errorHandler';

const EditFanzine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [authorId, setAuthorId] = useState('');
    
    // File Baru (Optional)
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    // Info File Lama
    const [oldCover, setOldCover] = useState('');
    const [oldPdf, setOldPdf] = useState('');

    const [authors, setAuthors] = useState<Author[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [authorData, fanzineData] = await Promise.all([
                    getAllAuthors(),
                    getFanzineById(id!)
                ]);
                
                setAuthors(authorData);
                
                setTitle(fanzineData.title);
                // Convert DB date string to YYYY-MM-DD for input type="date"
                const dateObj = new Date(fanzineData.date);
                setDate(dateObj.toISOString().split('T')[0]);
                
                setAuthorId(String(fanzineData.author_id));
                setOldCover(fanzineData.imgFilename);
                setOldPdf(fanzineData.pdfFilename);
                
            } catch (error) {
                console.error(error);
                alert("Gagal load data");
                navigate('/dashboard/fanzines');
            } finally {
                setIsLoading(false);
            }
        };
        if(id) loadData();
    }, [id, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('date', date);
            formData.append('author_id', authorId);
            
            // Hanya append jika user upload file baru
            if (coverFile) formData.append('cover', coverFile);
            if (pdfFile) formData.append('pdf', pdfFile);

            await updateFanzine(id!, formData);
            alert("Fanzine berhasil diupdate!");
            navigate('/dashboard/fanzines');
        } catch (error) {
            alert(`Gagal : ${getErrorMessage(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' };

    if (isLoading) return <div style={{padding: 20, color:'#94a3b8'}}>Loading...</div>;

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '20px' }}>Edit Fanzine</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: 24, borderRadius: 8, border: '1px solid #1e293b' }}>
                
                <label style={labelStyle}>Judul Edisi</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

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

                <div style={{marginBottom: 15, padding: 10, backgroundColor: '#1e293b', borderRadius: 6}}>
                    <label style={{...labelStyle, color: '#fbbf24'}}>Ganti Cover (Optional)</label>
                    <div style={{fontSize:'0.8rem', color:'#94a3b8', marginBottom: 5}}>Saat ini: {oldCover}</div>
                    <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files ? e.target.files[0] : null)} style={{...inputStyle, marginBottom:0}} />
                </div>

                <div style={{marginBottom: 25, padding: 10, backgroundColor: '#1e293b', borderRadius: 6}}>
                    <label style={{...labelStyle, color: '#fbbf24'}}>Ganti PDF (Optional)</label>
                    <div style={{fontSize:'0.8rem', color:'#94a3b8', marginBottom: 5}}>Saat ini: {oldPdf}</div>
                    <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files ? e.target.files[0] : null)} style={{...inputStyle, marginBottom:0}} />
                </div>

                <div style={{ display: 'flex', gap: 15 }}>
                    <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 12, backgroundColor: '#fbbf24', color: '#0f172a', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight:'bold' }}>
                        {isLoading ? 'Menyimpan...' : 'Update Fanzine'}
                    </button>
                    <Link to="/dashboard/fanzines" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center' }}>Batal</Link>
                </div>
            </form>
        </div>
    );
};

export default EditFanzine;