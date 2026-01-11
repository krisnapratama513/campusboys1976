import React, { useState, useEffect } from 'react';
import { FaCamera, FaUser } from 'react-icons/fa6';
import { updateMyProfile } from '../../services/userService';
import type { MemberDetail } from '../../types/user.types';

interface EditProfileModalProps {
    isOpen: boolean;
    currentUser: MemberDetail | null;
    onClose: () => void;
    onSuccess: () => void; // Untuk refresh data di halaman utama
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, currentUser, onClose, onSuccess }) => {
    // State Form
    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        phone: ''
    });

    // State Gambar
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    const [isSaving, setIsSaving] = useState(false);

    // Load data awal saat modal dibuka
    useEffect(() => {
        if (isOpen && currentUser) {
            setFormData({
                full_name: currentUser.full_name || '',
                bio: currentUser.bio || '',
                phone: currentUser.phone || ''
            });
            setPreviewImage(null); // Reset preview
            setSelectedFile(null);
        }
    }, [isOpen, currentUser]);

    // Handle Input Teks
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Upload Gambar
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setIsSaving(true);
        const submitData = new FormData();
        submitData.append('full_name', formData.full_name);
        submitData.append('bio', formData.bio);
        submitData.append('phone', formData.phone);
        
        if (selectedFile) {
            submitData.append('image', selectedFile);
        }

        try {
            await updateMyProfile(currentUser.id, submitData);
            alert("Profil berhasil diperbarui!");
            onSuccess(); // Refresh parent
            onClose();   // Tutup modal
        } catch (error: any) {
            alert("Gagal update: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !currentUser) return null;

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: 'white' };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style={{ color: 'white', marginTop: 0, borderBottom:'1px solid #334155', paddingBottom: 10 }}>Edit Profil Saya</h3>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* AREA FOTO (Preview & Upload) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ position: 'relative', width: 100, height: 100 }}>
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '3px solid #fbbf24' }} />
                            ) : (currentUser.image && currentUser.image !== 'default_user.png') ? (
                                <img src={`/uploads/profiles/${currentUser.image}`} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '3px solid #475569' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaUser size={40} color="#94a3b8" />
                                </div>
                            )}

                            <label style={{
                                position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fbbf24', color: '#0f172a',
                                width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                            }}>
                                <FaCamera size={14} />
                                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>

                    <label style={{ display: 'block', color:'#94a3b8', fontSize:'0.9rem', marginBottom:5 }}>Nama Lengkap</label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} style={inputStyle} placeholder="Nama sesuai KTP" />

                    <label style={{ display: 'block', color:'#94a3b8', fontSize:'0.9rem', marginBottom:5 }}>Bio Singkat</label>
                    <textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} style={{...inputStyle, resize:'vertical'}} placeholder="Ceritakan sedikit tentang dirimu..." />

                    <label style={{ display: 'block', color:'#94a3b8', fontSize:'0.9rem', marginBottom:5 }}>No WhatsApp</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="08xxxxxxxx" />

                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                        <button type="submit" disabled={isSaving} style={{ flex: 1, padding: 12, background: '#fbbf24', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>
                            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <button type="button" onClick={onClose} style={{ padding: '12px 20px', background: 'transparent', color: '#94a3b8', border: '1px solid #475569', borderRadius: 6, cursor: 'pointer' }}>Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;