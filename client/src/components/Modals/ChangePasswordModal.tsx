import React, { useState } from 'react';
import { changePassword } from '../../services/userService';

interface ChangePasswordModalProps {
    isOpen: boolean;
    userId: number;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, userId, onClose }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Konfirmasi password baru tidak cocok!');
            return;
        }

        setIsLoading(true);
        try {
            await changePassword(userId, formData);
            alert("Password berhasil diubah! Silakan login ulang untuk keamanan.");
            // Opsional: Logout user otomatis
            // localStorage.clear(); window.location.href = '/member';
            onClose();
            // Reset Form
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', marginBottom: 15 };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '10px', width: '350px', border: '1px solid #334155' }}>
                <h3 style={{ color: 'white', marginTop: 0, marginBottom: 20 }}>Ganti Password</h3>
                
                {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: 15, backgroundColor:'rgba(239,68,68,0.1)', padding:10, borderRadius:4 }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label style={{display:'block', color:'#94a3b8', fontSize:'0.85rem', marginBottom:5}}>Password Lama</label>
                    <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} style={inputStyle} required />

                    <label style={{display:'block', color:'#94a3b8', fontSize:'0.85rem', marginBottom:5}}>Password Baru</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} style={inputStyle} required placeholder="Min. 8 karakter" />

                    <label style={{display:'block', color:'#94a3b8', fontSize:'0.85rem', marginBottom:5}}>Ulangi Password Baru</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} required />
                    
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 10, background: '#ef4444', border: 'none', borderRadius: 6, fontWeight: 'bold', color:'white', cursor: 'pointer' }}>
                            {isLoading ? '...' : 'Ganti Password'}
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

export default ChangePasswordModal;