import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';

const AuthorEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Ambil ID dari URL
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 1. SAAT HALAMAN DIBUKA: AMBIL DATA LAMA
    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/authors/${id}`);
                const result = await response.json();
                if (result.data) {
                    setName(result.data.name); // Isi input dengan nama lama
                }
            } catch (error) {
                console.error("Gagal ambil data", error);
            }
        };

        fetchAuthor();
    }, [id]);

    // 2. SAAT TOMBOL SIMPAN DITEKAN
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
                method: 'PUT', // Pakai PUT untuk update
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) throw new Error('Gagal update');

            navigate('/dashboard/authors'); // Kembali ke tabel
        } catch (error) {
            alert("Gagal update data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '20px' }}>Edit Author</h2>
            
            <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '8px', border: '1px solid #334155' }}>
                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Nama Author</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid #475569',
                                backgroundColor: '#0f172a',
                                color: 'white'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{
                                backgroundColor: '#fbbf24', // Warna Kuning untuk Edit
                                color: '#0f172a',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Menyimpan...' : 'Update Data'}
                        </button>
                        
                        <Link to="/dashboard/authors" style={{ padding: '10px 20px', color: '#94a3b8', textDecoration: 'none', display:'flex', alignItems:'center' }}>
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthorEdit;