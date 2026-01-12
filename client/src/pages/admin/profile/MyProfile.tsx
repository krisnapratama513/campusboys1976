// client/src/pages/admin/profile/MyProfile.tsx

import { useState, useEffect } from 'react';
import { FaUser, FaWhatsapp, FaPencil, FaPenToSquare, FaLock } from 'react-icons/fa6'; 

import { getMemberDetail } from '../../../services/userService';
import type { MemberDetail } from '../../../types/user.types';
import { API_BASE_URL } from '../../../config/api'; // Import Config

// Import Modals
import EditProfileModal from '../../../components/Modals/EditProfileModal';
import ChangeUsernameModal from '../../../components/Modals/ChangeUsernameModal';
import ChangePasswordModal from '../../../components/Modals/ChangePasswordModal'; 

/**
 * Halaman Profil Saya (Self Service).
 * User bisa melihat data diri, ganti foto, ganti bio, ganti username, dan password.
 * * @component
 */
const MyProfile = () => {
    // State Data
    const [profile, setProfile] = useState<MemberDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // State Modal
    const [isEditOpen, setIsEditOpen] = useState(false);           
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false); 
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Helper: URL Root Server (untuk akses gambar)
    const serverRoot = API_BASE_URL.replace('/api', '');

    /**
     * Fetch Profile Data
     */
    const fetchProfile = async () => {
        setIsLoading(true);
        const userBox = localStorage.getItem('userBox');
        
        if (userBox) {
            try {
                const user = JSON.parse(userBox);
                // Panggil Service (Otomatis pakai Auth Header)
                const data = await getMemberDetail(user.id);
                setProfile(data);
            } catch (error: any) {
                console.error("Gagal load profile:", error);
                // Opsional: Redirect ke login jika token expired
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    /**
     * Callback: Update state lokal setelah ganti username sukses
     * (Tanpa perlu reload halaman penuh)
     */
    const handleUsernameSuccess = (newUsername: string) => {
        if (profile) {
            setProfile({ ...profile, username: newUsername });
        }
        
        // Update juga LocalStorage agar sesi tetap sinkron
        const userBox = localStorage.getItem('userBox');
        if (userBox) {
            const user = JSON.parse(userBox);
            user.username = newUsername;
            localStorage.setItem('userBox', JSON.stringify(user));
        }
    };

    // --- RENDER ---

    if (isLoading) return <div style={{ padding: 20, color: '#94a3b8' }}>Loading Profile...</div>;
    if (!profile) return <div style={{ padding: 20, color: '#ef4444' }}>Gagal memuat profil. Silakan login ulang.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', color: '#e2e8f0' }}>
            
            {/* === HEADER AREA (FOTO & NAMA) === */}
            <div style={{ 
                backgroundColor: '#1e293b', borderRadius: '12px', padding: '40px', 
                textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                position: 'relative', border: '1px solid #334155'
            }}>
                
                {/* Foto Profil */}
                <div style={{ marginBottom: 20 }}>
                    {(profile.image && profile.image !== 'default_user.png') ? (
                        <img 
                            // Gunakan URL Server
                            src={`${serverRoot}/uploads/profiles/${profile.image}`} 
                            alt="Profile" 
                            style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', border: '4px solid #0f172a', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} 
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/150?text=Error')}
                        />
                    ) : (
                        <div style={{ width: 150, height: 150, borderRadius: '50%', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '4px solid #0f172a' }}>
                            <FaUser size={60} color="#94a3b8" />
                        </div>
                    )}
                </div>

                {/* Nama & Role */}
                <h1 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', color: 'white', fontWeight: 'bold' }}>
                    {profile.full_name || profile.username}
                </h1>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 25 }}>
                    <span style={{ backgroundColor: '#2563eb', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>
                        {profile.role.toUpperCase()}
                    </span>
                    <span style={{ backgroundColor: '#475569', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', color: '#e2e8f0' }}>
                        {profile.chapter_name} • Gen {profile.generation}
                    </span>
                </div>

                {/* Tombol Edit Profil Utama */}
                <button 
                    onClick={() => setIsEditOpen(true)}
                    style={{ 
                        backgroundColor: 'transparent', border: '1px solid #fbbf24', color: '#fbbf24', 
                        padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                        fontWeight: 'bold', transition: 'all 0.2s', fontSize: '0.9rem'
                    }}
                >
                    <FaPencil /> Edit Profil
                </button>
            </div>

            {/* === CONTENT DETAILS === */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 25 }}>
                
                {/* 1. Box Bio */}
                <div style={{ backgroundColor: '#1e293b', padding: 25, borderRadius: 12, border: '1px solid #334155' }}>
                    <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: 15, marginTop: 0, color: '#f8fafc' }}>Tentang Saya</h3>
                    <p style={{ lineHeight: '1.6', color: profile.bio ? '#cbd5e1' : '#64748b', fontStyle: profile.bio ? 'normal' : 'italic', fontSize: '0.95rem' }}>
                        {profile.bio || "Belum ada bio. Klik tombol edit di atas untuk menambahkan deskripsi tentang dirimu."}
                    </p>
                </div>

                {/* 2. Box Kontak & Akun */}
                <div style={{ backgroundColor: '#1e293b', padding: 25, borderRadius: 12, border: '1px solid #334155' }}>
                    <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: 15, marginTop: 0, color: '#f8fafc' }}>Kontak & Akun</h3>
                    
                    {/* A. USERNAME */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
                        <div style={{ width: 42, height: 42, borderRadius: '8px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaUser color="#94a3b8" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <small style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Username Login</small>
                                <button 
                                    onClick={() => setIsUsernameModalOpen(true)}
                                    style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '0.8rem', display:'flex', alignItems:'center', gap: 4, fontWeight: 'bold' }}
                                >
                                    <FaPenToSquare /> Ubah
                                </button>
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'white' }}>@{profile.username}</div>
                        </div>
                    </div>

                    {/* B. WHATSAPP */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <div style={{ width: 42, height: 42, borderRadius: '8px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaWhatsapp color="#22c55e" size={20} />
                        </div>
                        <div>
                            <small style={{ color: '#94a3b8', fontSize: '0.8rem' }}>WhatsApp / HP</small>
                            <div style={{ fontWeight: 'bold', color: profile.phone ? 'white' : '#64748b', fontSize: '1rem' }}>
                                {profile.phone || "Belum diatur"}
                            </div>
                        </div>
                    </div>

                    {/* C. CHANGE PASSWORD */}
                    <div style={{ marginTop: 25, paddingTop: 20, borderTop: '1px solid #334155' }}>
                        <button 
                            onClick={() => setIsPasswordModalOpen(true)}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: 10,
                                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                padding: '12px 15px', borderRadius: '6px',
                                cursor: 'pointer', width: '100%', justifyContent: 'center', fontWeight: 'bold',
                                fontSize: '0.9rem', transition: 'all 0.2s'
                            }}
                        >
                            <FaLock /> Ganti Password Keamanan
                        </button>
                    </div>

                </div>
            </div>

            {/* === MODALS === */}
            <EditProfileModal 
                isOpen={isEditOpen}
                currentUser={profile} 
                onClose={() => setIsEditOpen(false)}
                onSuccess={fetchProfile} 
            />

            {profile && (
                <ChangeUsernameModal 
                    isOpen={isUsernameModalOpen}
                    userId={profile.id}
                    currentUsername={profile.username}
                    onClose={() => setIsUsernameModalOpen(false)}
                    onSuccess={handleUsernameSuccess} 
                />
            )}
            
            {profile && (
                <ChangePasswordModal 
                    isOpen={isPasswordModalOpen}
                    userId={profile.id}
                    onClose={() => setIsPasswordModalOpen(false)}
                />
            )}

        </div>
    );
};

export default MyProfile;