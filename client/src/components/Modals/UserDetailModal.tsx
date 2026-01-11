import React from 'react';
import { FaUser } from 'react-icons/fa6';
import type { MemberDetail } from '../../types/user.types';

interface UserDetailModalProps {
    isOpen: boolean;
    isLoading: boolean;
    member: MemberDetail | null;
    onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, isLoading, member, onClose }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            zIndex: 9999
        }}>
            <div style={{ 
                backgroundColor: '#1e293b', 
                padding: '30px', 
                borderRadius: '12px', 
                width: '400px', 
                maxWidth: '90%', 
                position: 'relative',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                border: '1px solid #334155'
            }}>
                
                {/* Tombol Close */}
                <button 
                    onClick={onClose}
                    style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                    ✕
                </button>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                        <p>Mengambil data profil...</p>
                    </div>
                ) : member ? (
                    <div style={{ textAlign: 'center' }}>
                        
                        {/* Logic Avatar: Icon vs Image */}
                        {(!member.image || member.image === 'default_user.png') ? (
                            <div style={{ 
                                width: 100, height: 100, borderRadius: '50%', 
                                backgroundColor: '#334155', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 15px auto', 
                                border: '4px solid #0f172a'
                            }}>
                                <FaUser size={40} color="#94a3b8" />
                            </div>
                        ) : (
                            <img 
                                src={`/uploads/profiles/${member.image}`} 
                                alt="Profile"
                                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '4px solid #0f172a', marginBottom: 15 }}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    // Tips: Bisa tambahkan fallback ke icon disini jika mau logic lebih kompleks
                                }}
                            />
                        )}
                        
                        <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>
                            {member.full_name || member.username}
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 20 }}>
                            {member.role.toUpperCase()} • {member.chapter_name} • Gen {member.generation}
                        </p>

                        <div style={{ textAlign: 'left', backgroundColor: '#0f172a', padding: 20, borderRadius: 8 }}>
                            <div style={{ marginBottom: 10 }}>
                                <strong style={{ color: '#38bdf8', fontSize: '0.8rem', display:'block' }}>BIO</strong>
                                <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                                    {member.bio || <span style={{fontStyle:'italic', color:'#64748b'}}>Belum diisi</span>}
                                </span>
                            </div>
                            <div>
                                <strong style={{ color: '#38bdf8', fontSize: '0.8rem', display:'block' }}>KONTAK / HP</strong>
                                <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                                    {member.phone || <span style={{fontStyle:'italic', color:'#64748b'}}>Belum diisi</span>}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p style={{ color: '#ef4444', textAlign: 'center', padding: '20px' }}>Data member tidak ditemukan.</p>
                )}
            </div>
        </div>
    );
};

export default UserDetailModal;