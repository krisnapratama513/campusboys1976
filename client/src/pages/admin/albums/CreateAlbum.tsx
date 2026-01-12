// client/src/pages/admin/albums/CreateAlbums.tsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createAlbum } from '../../../services/albumService';

const CreateAlbum = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // --- STATE FORM ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default hari ini (YYYY-MM-DD)
    const [status, setStatus] = useState('pending');

    // --- STATE GAMBAR (FILE & PREVIEW) ---
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');

    // Kita simpan gallery dalam bentuk Array of Object agar mudah dikelola (hapus preview)
    interface GalleryItem {
        file: File;
        preview: string;
        id: number; // ID unik sementara untuk key React
    }
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

    // 1. HANDLE COVER CHANGE
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file)); // Buat URL lokal untuk preview
        }
    };

    // 2. HANDLE GALLERY CHANGE (MULTIPLE)
    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            
            // Konversi File menjadi Object Preview
            const newItems: GalleryItem[] = newFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                id: Date.now() + Math.random() // ID acak agar unik
            }));

            // Tambahkan ke state yang sudah ada (Accumulate)
            setGalleryItems(prev => [...prev, ...newItems]);
        }
    };

    // 3. REMOVE SINGLE GALLERY ITEM (Hapus dari Preview sebelum upload)
    const removeGalleryItem = (idToRemove: number) => {
        setGalleryItems(prev => prev.filter(item => item.id !== idToRemove));
    };

    // 4. CLEANUP MEMORY (Penting!)
    // Saat komponen ditutup, hapus URL object agar tidak memory leak
    useEffect(() => {
        return () => {
            if (coverPreview) URL.revokeObjectURL(coverPreview);
            galleryItems.forEach(item => URL.revokeObjectURL(item.preview));
        };
    }, []);

    // 5. SUBMIT KE SERVER
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !coverFile) {
            alert("Judul dan Foto Cover wajib diisi!");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('date', date);
            formData.append('status', status);
            
            // Append Single Cover
            formData.append('cover', coverFile);

            // Append Multiple Photos
            // Perhatikan: nama field 'photos' harus sama dengan config Multer di backend
            galleryItems.forEach(item => {
                formData.append('photos', item.file);
            });

            await createAlbum(formData);
            alert("Album berhasil dibuat!");
            navigate('/dashboard/albums');

        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- STYLES (Inline untuk kemudahan) ---
    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#94a3b8' };
    const sectionStyle = { border: '1px solid #334155', padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#0f172a' };

    if (isLoading) return <div style={{ color: 'white', padding: 20 }}>Mengupload data dan foto... Mohon tunggu.</div>;

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '20px' }}>Buat Album Baru</h2>
            
            <form onSubmit={handleSubmit}>
                
                {/* BAGIAN 1: INFO UTAMA */}
                <div style={sectionStyle}>
                    <label style={labelStyle}>Judul Album</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} placeholder="Contoh: Liburan Bali 2024" />

                    <label style={labelStyle}>Deskripsi</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, height: '80px' }} placeholder="Ceritakan sedikit tentang album ini..." />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Tanggal Event</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                                <option value="pending">Pending (Draft)</option>
                                <option value="publish">Publish (Tayang)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* BAGIAN 2: COVER PHOTO */}
                <div style={sectionStyle}>
                    <label style={{ ...labelStyle, color: '#fbbf24', fontWeight: 'bold' }}>Foto Sampul (Cover)</label>
                    <input type="file" accept="image/*" onChange={handleCoverChange} style={inputStyle} required />
                    
                    {coverPreview && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={coverPreview} alt="Preview Cover" style={{ width: '100%', maxWidth: '300px', borderRadius: '6px', border: '2px solid #fbbf24' }} />
                        </div>
                    )}
                </div>

                {/* BAGIAN 3: GALLERY PHOTOS (MULTIPLE) */}
                <div style={sectionStyle}>
                    <label style={labelStyle}>Foto Galeri (Bisa pilih banyak sekaligus)</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple // <--- MAGIC KEYWORD
                        onChange={handleGalleryChange} 
                        style={inputStyle} 
                    />
                    
                    {/* Grid Preview */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginTop: '10px' }}>
                        {galleryItems.map((item) => (
                            <div key={item.id} style={{ position: 'relative', height: '100px' }}>
                                <img 
                                    src={item.preview} 
                                    alt="Preview" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
                                />
                                {/* Tombol Hapus X */}
                                <button 
                                    type="button"
                                    onClick={() => removeGalleryItem(item.id)}
                                    style={{
                                        position: 'absolute', top: '-5px', right: '-5px',
                                        backgroundColor: '#ef4444', color: 'white',
                                        border: 'none', borderRadius: '50%',
                                        width: '20px', height: '20px', cursor: 'pointer',
                                        fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    {galleryItems.length > 0 && (
                        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
                            Total {galleryItems.length} foto dipilih.
                        </div>
                    )}
                </div>

                {/* BUTTONS */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                        Simpan Album
                    </button>
                    <Link to="/dashboard/albums" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CreateAlbum;