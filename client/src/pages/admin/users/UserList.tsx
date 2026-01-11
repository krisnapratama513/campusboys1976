import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMembers, deleteMember, getMemberDetail } from '../../../services/userService';
import type { Member, MemberDetail } from '../../../types/user.types';

// Import Komponen Modal
import UserDetailModal from '../../../components/Modals/UserDetailModal';
import EditMemberModal from '../../../components/Modals/EditMemberModal'; // <--- Import Modal Edit

const UserList = () => {
    // State Tabel
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // State Modal Detail (View)
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberDetail | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    // State Modal Edit (Admin Only)
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<MemberDetail | null>(null);

    // STATE USER LOGIN
    const [currentUserRole, setCurrentUserRole] = useState<string>('');

    // Fetch Data List & Cek User Login
    const fetchData = () => {
        setIsLoading(true);
        getMembers()
            .then(data => setMembers(data))
            .catch(err => alert(err.message))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
        
        // Cek Role User yang sedang login dari localStorage
        const userBox = localStorage.getItem('userBox');
        if (userBox) {
            const user = JSON.parse(userBox);
            setCurrentUserRole(user.role);
        }
    }, []);

    // Handle Delete (Hanya Admin)
    const handleDelete = async (id: number, username: string) => {
        if (!window.confirm(`Yakin ingin menghapus user "${username}"?`)) return;
        try {
            await deleteMember(id);
            fetchData();
        } catch (error: any) {
            alert(error.message);
        }
    };

    // Handle Open Detail (Semua User)
    const handleOpenDetail = async (id: number) => {
        setIsDetailOpen(true);
        setIsDetailLoading(true);
        setSelectedMember(null); 
        try {
            const detail = await getMemberDetail(id);
            setSelectedMember(detail);
        } catch (error: any) {
            alert("Gagal memuat: " + error.message);
            setIsDetailOpen(false);
        } finally {
            setIsDetailLoading(false);
        }
    };

    // Handle Open Edit (Admin Only)
    const handleOpenEdit = async (id: number) => {
        // Kita perlu data detail dulu untuk mengisi form edit
        try {
            const detail = await getMemberDetail(id);
            setMemberToEdit(detail);
            setIsEditOpen(true);
        } catch (error: any) {
            alert("Gagal memuat data edit: " + error.message);
        }
    };

    // Helper Badge (Sama seperti sebelumnya)
    const getRoleBadge = (role: string) => {
        const styles: any = {
            superadmin: { bg: '#dc2626', color: 'white' },
            editor: { bg: '#2563eb', color: 'white' },
            creative: { bg: '#d97706', color: 'white' },
            member: { bg: '#475569', color: '#e2e8f0' }
        };
        const style = styles[role] || styles.member;
        return (
            <span style={{ backgroundColor: style.bg, color: style.color, padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                {role}
            </span>
        );
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2>Directory Members</h2>
                
                {/* Tombol Tambah Hanya untuk Superadmin */}
                {currentUserRole === 'superadmin' && (
                    <Link to="/dashboard/users/create" style={{ backgroundColor: '#fbbf24', color: '#0f172a', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                        + Tambah Member
                    </Link>
                )}
            </div>

             <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                 <thead style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                    <tr>
                        <th style={{ padding: 15, textAlign: 'left' }}>Username</th>
                        <th style={{ padding: 15, textAlign: 'left' }}>Role</th>
                        <th style={{ padding: 15, textAlign: 'left' }}>Chapter</th>
                        <th style={{ padding: 15, textAlign: 'center' }}>Gen</th>
                        <th style={{ padding: 15, textAlign: 'right' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center' }}>Loading directory...</td></tr>
                    ) : members.length === 0 ? (
                        <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center' }}>Belum ada member.</td></tr>
                    ) : (
                        members.map((m) => (
                            <tr key={m.id} style={{ borderBottom: '1px solid #334155' }}>
                                <td style={{ padding: 15, fontWeight: 'bold' }}>{m.username}</td>
                                <td style={{ padding: 15 }}>{getRoleBadge(m.role)}</td>
                                <td style={{ padding: 15 }}>{m.chapter_name || '-'}</td>
                                <td style={{ padding: 15, textAlign: 'center' }}>{m.generation}</td>
                                <td style={{ padding: 15, textAlign: 'right' }}>
                                    
                                    {/* Tombol DETAIL (Semua User Bisa Lihat) */}
                                    <button 
                                        onClick={() => handleOpenDetail(m.id)}
                                        style={{ marginRight: 10, backgroundColor: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', padding: '5px 10px', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        👁️ Detail
                                    </button>

                                    {/* Tombol EDIT & HAPUS (Hanya Superadmin) */}
                                    {currentUserRole === 'superadmin' && (
                                        <>
                                            <button 
                                                onClick={() => handleOpenEdit(m.id)}
                                                style={{ marginRight: 10, backgroundColor: 'transparent', border: '1px solid #fbbf24', color: '#fbbf24', padding: '5px 10px', borderRadius: 4, cursor: 'pointer' }}
                                            >
                                                ✎ Edit
                                            </button>

                                            <button 
                                                onClick={() => handleDelete(m.id, m.username)} 
                                                style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                Hapus
                                            </button>
                                        </>
                                    )}

                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
             </table>

            {/* MODAL VIEW (Semua) */}
            <UserDetailModal 
                isOpen={isDetailOpen}
                isLoading={isDetailLoading}
                member={selectedMember}
                onClose={() => setIsDetailOpen(false)}
            />

            {/* MODAL EDIT (Admin Only) */}
            <EditMemberModal 
                isOpen={isEditOpen}
                member={memberToEdit}
                onClose={() => setIsEditOpen(false)}
                onSuccess={fetchData} // Refresh tabel setelah edit
            />
        </div>
    );
};

export default UserList;