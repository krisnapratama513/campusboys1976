// client/src/pages/admin/fanzines/CreateFanzine.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Service
import { createFanzine } from '../../../services/fanzineService';

// Kita butuh list author untuk dropdown
// Pastikan path ini sesuai dengan file service author anda di client
// import { getAllAuthors } from '../../../services/authorService'; 
import { getAllAuthors } from '../../../services/authorService';

const CreateFanzine = () => {
    const navigate = useNavigate();

    // State Form
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [authorId, setAuthorId] = useState('');
    
    // State File
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    // Data Pendukung
    const [authors, setAuthors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Ambil Data Author saat halaman dibuka
    useEffect(() => {
        getAllAuthors()
            .then((data) => setAuthors(data))
            .catch((err) => console.error("Gagal load authors", err));
    }, []);

    // 2. Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi Manual
        if (!title || !authorId || !coverFile || !pdfFile) {
            alert("Semua field (termasuk Cover & PDF) wajib diisi!");
            return;
        }

        setIsLoading(true);

        try {
            // Gunakan FormData untuk kirim File
            const formData = new FormData();
            formData.append('title', title);
            formData.append('date', date); // Bisa string kosong, backend handle null
            formData.append('author_id', authorId);
            
            // Nama field harus sama dengan config Multer di Backend ('cover' & 'pdf')
            formData.append('cover', coverFile);
            formData.append('pdf', pdfFile);

            await createFanzine(formData);

            alert("Berhasil upload Fanzine!");
            navigate('/dashboard/fanzines'); // Kembali ke list (sesuaikan route)

        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Style Input (Agar rapi)
    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        backgroundColor: '#1e293b',
        border: '1px solid #475569',
        color: 'white',
        marginBottom: '16px'
    };

    const labelStyle = {
        display: 'block',
        color: '#94a3b8',
        marginBottom: '6px',
        fontSize: '0.9rem'
    };

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
                Upload Fanzine Baru
            </h2>

            <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '8px' }}>
                
                {/* Judul */}
                <div>
                    <label style={labelStyle}>Judul Fanzine</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={inputStyle}
                        placeholder="Contoh: Majalah Sekolah Edisi 1"
                    />
                </div>

                {/* Tanggal Rilis */}
                <div>
                    <label style={labelStyle}>Tanggal Rilis (Opsional)</label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* Dropdown Author */}
                <div>
                    <label style={labelStyle}>Penulis / Author</label>
                    <select 
                        value={authorId}
                        onChange={(e) => setAuthorId(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="">-- Pilih Author --</option>
                        {authors.map((auth) => (
                            <option key={auth.id} value={auth.id}>
                                {auth.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Input Cover (Image) */}
                <div>
                    <label style={labelStyle}>Cover Gambar (.jpg, .png)</label>
                    <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)}
                        style={inputStyle}
                    />
                </div>

                {/* Input PDF */}
                <div>
                    <label style={labelStyle}>File PDF</label>
                    <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
                        style={inputStyle}
                    />
                </div>

                {/* Tombol Submit */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: isLoading ? '#64748b' : '#38bdf8',
                        color: isLoading ? '#cbd5e1' : '#0f172a',
                        fontWeight: 'bold',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        marginTop: '10px'
                    }}
                >
                    {isLoading ? 'Mengupload...' : 'Simpan Fanzine'}
                </button>

            </form>
        </div>
    );
};

export default CreateFanzine;