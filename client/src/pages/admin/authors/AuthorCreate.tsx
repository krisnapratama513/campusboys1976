// client/src/pages/admin/authors/AuthorCreate.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createAuthor } from '../../../services/authorService';
import { getErrorMessage } from '../../../utils/errorHandler';

/**
 * Halaman Admin: Tambah Author Baru.
 * Menggunakan service 'createAuthor' untuk menangani request ke API
 * dengan header otentikasi yang benar.
 * * @component
 */
const AuthorCreate = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handle Submit Form
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Panggil Service (Otomatis handle Auth Header)
            await createAuthor(name);

            // Jika sukses, redirect
            navigate('/dashboard/authors');
        } catch (error) {
            // Tampilkan pesan error dari backend (misal: "Nama author sudah terdaftar")
            alert("Gagal" + getErrorMessage(error));
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
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
                            Nama Lengkap
                        </label>
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
                            alignItems: 'center',
                            fontWeight: '500'
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