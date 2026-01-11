import { useState, useEffect } from 'react';
import { FaUser, FaWhatsapp, FaPencil, FaPenToSquare, FaLock } from 'react-icons/fa6'; 

import { getMemberDetail } from '../../../services/userService';
import type { MemberDetail } from '../../../types/user.types';

// Import Modal
import EditProfileModal from '../../../components/Modals/EditProfileModal';
import ChangeUsernameModal from '../../../components/Modals/ChangeUsernameModal';
import ChangePasswordModal from '../../../components/Modals/ChangePasswordModal'; 

const MyProfile = () => {
    // State Data
    const [profile, setProfile] = useState<MemberDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // State Modal
    const [isEditOpen, setIsEditOpen] = useState(false);           
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false); 
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // 1. Fetch Data User saat Load
    const fetchProfile = async () => {
        setIsLoading(true);
        const userBox = localStorage.getItem('userBox');
        if (userBox) {
            const user = JSON.parse(userBox);
            try {
                const data = await getMemberDetail(user.id);
                setProfile(data);
            } catch (error: any) {
                console.error("Gagal load profile:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // 2. Handler khusus saat Username Berhasil Diganti
    const handleUsernameSuccess = (newUsername: string) => {
        if (profile) {
            setProfile({ ...profile, username: newUsername });
        }
        
        const userBox = localStorage.getItem('userBox');
        if (userBox) {
            const user = JSON.parse(userBox);
            user.username = newUsername;
            localStorage.setItem('userBox', JSON.stringify(user));
        }
    };

    if (isLoading) return <div style={{ padding: 20, color: 'white' }}>Loading Profile...</div>;
    if (!profile) return <div style={{ padding: 20, color: 'red' }}>Gagal memuat profil. Silakan login ulang.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', color: '#e2e8f0' }}>
            
            {/* === HEADER AREA (FOTO & NAMA) === */}
            <div style={{ 
                backgroundColor: '#1e293b', borderRadius: '12px', padding: '40px', 
                textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                position: 'relative'
            }}>
                
                {/* Foto Profil */}
                <div style={{ marginBottom: 20 }}>
                    {(profile.image && profile.image !== 'default_user.png') ? (
                        <img 
                            src={`/uploads/profiles/${profile.image}`} 
                            alt="Profile" 
                            style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', border: '4px solid #0f172a', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} 
                        />
                    ) : (
                        <div style={{ width: 150, height: 150, borderRadius: '50%', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '4px solid #0f172a' }}>
                            <FaUser size={60} color="#94a3b8" />
                        </div>
                    )}
                </div>

                {/* Nama & Role */}
                <h1 style={{ margin: '0 0 5px 0', fontSize: '1.8rem', color: 'white' }}>
                    {profile.full_name || profile.username}
                </h1>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                    <span style={{ backgroundColor: '#2563eb', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {profile.role.toUpperCase()}
                    </span>
                    <span style={{ backgroundColor: '#475569', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem' }}>
                        {profile.chapter_name} • Gen {profile.generation}
                    </span>
                </div>

                {/* Tombol Edit Profil Utama */}
                <button 
                    onClick={() => setIsEditOpen(true)}
                    style={{ 
                        backgroundColor: 'transparent', border: '1px solid #fbbf24', color: '#fbbf24', 
                        padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                        fontWeight: 'bold', transition: 'all 0.2s'
                    }}
                >
                    <FaPencil /> Edit Profil
                </button>
            </div>

            {/* === CONTENT DETAILS === */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 20 }}>
                
                {/* 1. Box Bio */}
                <div style={{ backgroundColor: '#1e293b', padding: 25, borderRadius: 12 }}>
                    <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: 10, marginTop: 0 }}>Tentang Saya</h3>
                    <p style={{ lineHeight: '1.6', color: profile.bio ? '#e2e8f0' : '#64748b', fontStyle: profile.bio ? 'normal' : 'italic' }}>
                        {profile.bio || "Belum ada bio. Klik edit untuk menambahkan deskripsi tentang dirimu."}
                    </p>
                </div>

                {/* 2. Box Kontak & Akun */}
                <div style={{ backgroundColor: '#1e293b', padding: 25, borderRadius: 12 }}>
                    <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: 10, marginTop: 0 }}>Kontak & Akun</h3>
                    
                    {/* A. BAGIAN USERNAME */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaUser color="#94a3b8" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <small style={{ color: '#94a3b8' }}>Username Login</small>
                                <button 
                                    onClick={() => setIsUsernameModalOpen(true)}
                                    style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '0.8rem', display:'flex', alignItems:'center', gap: 4 }}
                                >
                                    <FaPenToSquare /> Ubah
                                </button>
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>@{profile.username}</div>
                        </div>
                    </div>

                    {/* B. BAGIAN WHATSAPP (Saya pindah ke atas tombol password) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaWhatsapp color="#22c55e" size={20} />
                        </div>
                        <div>
                            <small style={{ color: '#94a3b8' }}>WhatsApp / HP</small>
                            <div style={{ fontWeight: 'bold', color: profile.phone ? 'white' : '#64748b' }}>
                                {profile.phone || "Belum diatur"}
                            </div>
                        </div>
                    </div>

                    {/* C. TOMBOL GANTI PASSWORD (Di Paling Bawah) */}
                    <div style={{ marginTop: 20, paddingTop: 15, borderTop: '1px solid #334155' }}>
                        <button 
                            onClick={() => setIsPasswordModalOpen(true)}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: 10,
                                backgroundColor: 'rgba(239, 68, 68, 0.1)', // Merah transparan
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                padding: '10px 15px', borderRadius: '6px',
                                cursor: 'pointer', width: '100%', justifyContent: 'center', fontWeight: 'bold'
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