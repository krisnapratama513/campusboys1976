import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';

const AuthorCreate = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Cegah reload
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/authors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) throw new Error('Gagal menambah author');

            // Sukses -> Kembali ke tabel
            navigate('/dashboard/authors');
        } catch (error) {
            alert("Error: Gagal menyimpan data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ color: '#e2e8f0', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '20px' }}>Tambah Author Baru</h2>
            
            <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '8px', border: '1px solid #334155' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Nama Lengkap</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Contoh: Tere Liye"
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
                                backgroundColor: '#38bdf8',
                                color: '#0f172a',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1
                            }}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                        </button>
                        
                        <Link to="/dashboard/authors" style={{
                            padding: '10px 20px',
                            color: '#94a3b8',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthorCreate;