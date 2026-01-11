import React, { useState } from 'react';
import { updateUsername } from '../../services/userService';

interface ChangeUsernameModalProps {
    isOpen: boolean;
    userId: number;
    currentUsername: string;
    onClose: () => void;
    onSuccess: (newUsername: string) => void;
}

const ChangeUsernameModal: React.FC<ChangeUsernameModalProps> = ({ isOpen, userId, currentUsername, onClose, onSuccess }) => {
    const [username, setUsername] = useState(currentUsername);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (username === currentUsername) {
            onClose();
            return;
        }

        setIsLoading(true);
        try {
            await updateUsername(userId, username);
            alert("Username berhasil diubah! Silakan login ulang nanti dengan username baru.");
            onSuccess(username); // Update tampilan di parent
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '10px', width: '350px', border: '1px solid #334155' }}>
                <h3 style={{ color: 'white', marginTop: 0 }}>Ganti Username</h3>
                
                {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: 10 }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value.trim())} // Auto trim spasi
                        placeholder="Username baru"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', marginBottom: 15 }}
                    />
                    
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 10, background: '#fbbf24', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>
                            {isLoading ? '...' : 'Simpan'}
                        </button>
                        <button type="button" onClick={onClose} style={{ padding: '10px 15px', background: 'transparent', color: '#94a3b8', border: '1px solid #475569', borderRadius: 6, cursor: 'pointer' }}>
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeUsernameModal;