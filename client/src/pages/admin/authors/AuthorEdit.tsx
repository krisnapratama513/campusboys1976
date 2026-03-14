// client/src/pages/admin/authors/AuthorEdit.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getAuthorById, updateAuthor } from '../../../services/authorService';
import { getErrorMessage } from '../../../utils/errorHandler';

/**
 * Halaman Admin: Edit Author.
 * 1. Load data author lama berdasarkan ID.
 * 2. Update data author dengan validasi backend (Auth & Duplicate Check).
 * * @component
 */
const AuthorEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Ambil ID dari URL
    
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Effect: Load Data Lama
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                if (id) {
                    const data = await getAuthorById(id);
                    setName(data.name);
                }
            } catch (error) {
                console.error("Gagal load data author:", error);
                navigate('/dashboard/authors'); // Redirect jika ID tidak valid
            }
        };

        loadData();
    }, [id, navigate]);

    /**
     * Handle Update
     */
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!id) return;
        setIsLoading(true);

        try {
            // Panggil Service Update
            await updateAuthor(id, name);

            // Redirect sukses
            navigate('/dashboard/authors');
        } catch (error) {
            alert("Gagal" + getErrorMessage(error));
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
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
                            Nama Author
                        </label>
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
                                backgroundColor: '#fbbf24', // Warna Kuning (Warning/Edit)
                                color: '#0f172a',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1
                            }}
                        >
                            {isLoading ? 'Menyimpan...' : 'Update Data'}
                        </button>
                        
                        <Link to="/dashboard/authors" style={{ 
                            padding: '10px 20px', 
                            color: '#94a3b8', 
                            textDecoration: 'none', 
                            display:'flex', 
                            alignItems:'center',
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

export default AuthorEdit;