import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getAlbumById, updateAlbum, deleteAlbumPhoto } from '../../../services/albumService';
import type { Album, AlbumPhoto } from '../../../types/album.types';

// [1] IMPORT CONFIG API
import { SERVER_ROOT } from '../../../config/api';
import { getErrorMessage } from '../../../utils/errorHandler';

const EditAlbum = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE FORM ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('pending');

    // --- STATE COVER ---
    const [currentCover, setCurrentCover] = useState(''); // Nama file lama
    const [newCoverFile, setNewCoverFile] = useState<File | null>(null); // File baru
    const [newCoverPreview, setNewCoverPreview] = useState<string>('');

    // --- STATE GALLERY ---
    const [existingPhotos, setExistingPhotos] = useState<AlbumPhoto[]>([]);
    
    interface GalleryItem {
        file: File;
        preview: string;
        id: number;
    }
    const [newGalleryItems, setNewGalleryItems] = useState<GalleryItem[]>([]);

    // 1. LOAD DATA AWAL
    useEffect(() => {
        if (!id) return;

        getAlbumById(id)
            .then((data: Album) => {
                setTitle(data.title);
                setDescription(data.description || '');
                
                const dateObj = new Date(data.date);
                // Validasi agar tidak error jika tanggal invalid
                if(!isNaN(dateObj.getTime())) {
                    setDate(dateObj.toISOString().split('T')[0]);
                }
                
                setStatus(data.status);
                setCurrentCover(data.image);
                
                if (data.photos) {
                    setExistingPhotos(data.photos);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Gagal memuat data album.");
                navigate('/dashboard/albums');
            })
            .finally(() => setIsLoading(false));
    }, [id, navigate]);

    // 2. CLEANUP MEMORY
    useEffect(() => {
        return () => {
            if (newCoverPreview) URL.revokeObjectURL(newCoverPreview);
            newGalleryItems.forEach(item => URL.revokeObjectURL(item.preview));
        };
    }, []);

    // HANDLERS...
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewCoverFile(file);
            setNewCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleNewGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const newItems: GalleryItem[] = newFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                id: Date.now() + Math.random()
            }));
            setNewGalleryItems(prev => [...prev, ...newItems]);
        }
    };

    const removeNewGalleryItem = (tempId: number) => {
        setNewGalleryItems(prev => prev.filter(item => item.id !== tempId));
    };

    const handleDeleteExistingPhoto = async (photoId: number) => {
        if (!window.confirm("Hapus foto ini secara permanen?")) return;

        try {
            await deleteAlbumPhoto(photoId);
            setExistingPhotos(prev => prev.filter(p => p.id !== photoId));
        } catch (error) {
            alert("Gagal menghapus foto: " + getErrorMessage(error));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('date', date);
            formData.append('status', status);

            if (newCoverFile) {
                formData.append('cover', newCoverFile);
            }

            newGalleryItems.forEach(item => {
                formData.append('photos', item.file);
            });

            await updateAlbum(id!, formData);
            alert("Album berhasil diupdate!");
            navigate('/dashboard/albums');

        } catch (error) {
            alert("Gagal update: " + getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    // --- STYLES ---
    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #475569', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#94a3b8' };
    const sectionStyle = { border: '1px solid #334155', padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#0f172a' };
    const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginTop: '10px' };

    if (isLoading) return <div style={{ color: 'white', padding: 20 }}>Memuat data...</div>;

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '20px' }}>Edit Album</h2>
            
            <form onSubmit={handleSubmit}>
                
                {/* INFO UTAMA */}
                <div style={sectionStyle}>
                    <label style={labelStyle}>Judul Album</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

                    <label style={labelStyle}>Deskripsi</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, height: '80px' }} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Tanggal Event</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                                <option value="pending">Pending</option>
                                <option value="publish">Publish</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* COVER PHOTO */}
                <div style={sectionStyle}>
                    <label style={{...labelStyle, color:'#fbbf24'}}>Foto Sampul (Cover)</label>
                    
                    {/* Tampilkan Cover Lama jika belum ganti */}
                    {!newCoverPreview && currentCover && (
                        <div style={{marginBottom: 10}}>
                            <div style={{fontSize: '0.8rem', color: '#94a3b8', marginBottom: 5}}>Cover Saat Ini:</div>
                            
                            {/* [UPDATE] SRC Mengarah ke Server */}
                            <img 
                                src={`${SERVER_ROOT}/uploads/albums/covers/${currentCover}`} 
                                alt="Old Cover" 
                                style={{height: '100px', borderRadius: '4px', border: '1px solid #475569'}} 
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Error')}
                            />
                        </div>
                    )}

                    <input type="file" accept="image/*" onChange={handleCoverChange} style={inputStyle} />
                    
                    {newCoverPreview && (
                        <div style={{ marginTop: '10px' }}>
                            <div style={{fontSize: '0.8rem', color: '#fbbf24', marginBottom: 5}}>Akan diganti menjadi:</div>
                            <img src={newCoverPreview} alt="New Cover" style={{ maxWidth: '200px', borderRadius: '6px', border: '2px solid #fbbf24' }} />
                        </div>
                    )}
                </div>

                {/* GALLERY MANAGEMENT */}
                <div style={sectionStyle}>
                    <label style={{...labelStyle, fontWeight:'bold', borderBottom:'1px solid #334155', paddingBottom:5}}>Manajemen Galeri Foto</label>
                    
                    {/* A. FOTO LAMA (EXISTING) */}
                    <h4 style={{marginTop: 15, marginBottom: 10, fontSize: '0.9rem'}}>Foto Yang Sudah Ada ({existingPhotos.length})</h4>
                    {existingPhotos.length === 0 ? (
                        <p style={{fontSize:'0.8rem', color: '#64748b', fontStyle:'italic'}}>Tidak ada foto di galeri ini.</p>
                    ) : (
                        <div style={gridStyle}>
                            {existingPhotos.map((photo) => (
                                <div key={photo.id} style={{ position: 'relative', height: '100px' }}>
                                    
                                    {/* [UPDATE] SRC Mengarah ke Server */}
                                    <img 
                                        src={`${SERVER_ROOT}/uploads/albums/gallery/${photo.image_filename}`} 
                                        alt="Existing" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '1px solid #475569' }} 
                                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Error')}
                                    />
                                    
                                    <button 
                                        type="button"
                                        onClick={() => handleDeleteExistingPhoto(photo.id)}
                                        title="Hapus Permanen"
                                        style={{
                                            position: 'absolute', top: '-5px', right: '-5px',
                                            backgroundColor: '#b91c1c', color: 'white',
                                            border: 'none', borderRadius: '50%',
                                            width: '24px', height: '24px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* B. TAMBAH FOTO BARU */}
                    <h4 style={{marginTop: 30, marginBottom: 10, fontSize: '0.9rem', color: '#38bdf8'}}>+ Upload Foto Baru</h4>
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleNewGalleryChange} 
                        style={inputStyle} 
                    />
                    
                    {newGalleryItems.length > 0 && (
                        <div style={gridStyle}>
                            {newGalleryItems.map((item) => (
                                <div key={item.id} style={{ position: 'relative', height: '100px' }}>
                                    <img 
                                        src={item.preview} 
                                        alt="New Preview" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '2px solid #38bdf8' }} 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => removeNewGalleryItem(item.id)}
                                        style={{
                                            position: 'absolute', top: '-5px', right: '-5px',
                                            backgroundColor: '#ef4444', color: 'white',
                                            border: 'none', borderRadius: '50%',
                                            width: '20px', height: '20px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BUTTONS */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#fbbf24', color: '#0f172a', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                        Simpan Perubahan
                    </button>
                    <Link to="/dashboard/albums" style={{ padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditAlbum;