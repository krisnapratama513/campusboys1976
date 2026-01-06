import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getFanzineById, updateFanzine } from '../../../services/fanzineService';
import { getAllAuthors } from '../../../services/authorService';

const EditFanzine = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State Data
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [authorId, setAuthorId] = useState('');
    
    // State File Baru (Opsional)
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    // Preview Data Lama
    const [oldCover, setOldCover] = useState<string | null>(null);
    const [oldPdf, setOldPdf] = useState<string | null>(null);

    const [authors, setAuthors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. LOAD DATA SAAT BUKA
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load Authors & Fanzine Data paralel
                const [authorsData, fanzineData] = await Promise.all([
                    getAllAuthors(),
                    getFanzineById(id!)
                ]);

                setAuthors(authorsData);
                
                // Isi Form dengan data lama
                setTitle(fanzineData.title);
                // Format date YYYY-MM-DD untuk input type="date"
                if (fanzineData.date) {
                    const isoDate = new Date(fanzineData.date).toISOString().split('T')[0];
                    setDate(isoDate);
                }
                setAuthorId(String(fanzineData.author_id || '')); // author_id mungkin perlu dicek di backend returnnya
                setOldCover(fanzineData.imgFilename);
                setOldPdf(fanzineData.pdfFilename);

            } catch (error) {
                console.error(error);
                alert("Gagal memuat data");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    // 2. SUBMIT UPDATE
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const confirm = window.confirm("Simpan perubahan?");
        if (!confirm) return;

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('date', date);
            formData.append('author_id', authorId);
            
            // Hanya append file jika user memilih file baru
            if (coverFile) formData.append('cover', coverFile);
            if (pdfFile) formData.append('pdf', pdfFile);

            await updateFanzine(id!, formData);

            alert("Berhasil diupdate!");
            navigate('/dashboard/fanzines');

        } catch (error: any) {
            alert(error.message);
            setIsLoading(false);
        }
    };

    // Helper Style (Sama kayak Create)
    const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white', marginBottom: '16px' };
    const labelStyle = { display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '0.9rem' };

    if (isLoading) return <div style={{color:'white'}}>Loading data...</div>;

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Edit Fanzine</h2>

            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '8px' }}>
                
                <div>
                    <label style={labelStyle}>Judul Fanzine</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
                </div>

                <div>
                    <label style={labelStyle}>Tanggal Rilis</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
                </div>

                <div>
                    <label style={labelStyle}>Penulis</label>
                    <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} style={inputStyle}>
                        <option value="">-- Pilih Author --</option>
                        {authors.map((auth) => <option key={auth.id} value={auth.id}>{auth.name}</option>)}
                    </select>
                </div>

                {/* Cover Upload */}
                <div>
                    <label style={labelStyle}>Ganti Cover (Opsional)</label>
                    {oldCover && <div style={{marginBottom: 5, fontSize:'0.8rem', color: '#fbbf24'}}>Cover saat ini: {oldCover}</div>}
                    <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)} style={inputStyle} />
                </div>

                {/* PDF Upload */}
                <div>
                    <label style={labelStyle}>Ganti PDF (Opsional)</label>
                    {oldPdf && <div style={{marginBottom: 5, fontSize:'0.8rem', color: '#fbbf24'}}>File saat ini: {oldPdf}</div>}
                    <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} style={inputStyle} />
                </div>

                <div style={{display:'flex', gap: 10}}>
                    <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '12px', backgroundColor: '#fbbf24', color: '#0f172a', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                        Update Data
                    </button>
                    <Link to="/dashboard/fanzines" style={{ padding: '12px', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        Batal
                    </Link>
                </div>

            </form>
        </div>
    );
};

export default EditFanzine;