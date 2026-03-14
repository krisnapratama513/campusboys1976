// client/src/pages/admin/users/UserList.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMembers, deleteMember, getMemberDetail } from '../../../services/userService';
import type { Member, MemberDetail } from '../../../types/user.types';

// Components
import UserDetailModal from '../../../components/Modals/UserDetailModal';
import EditMemberModal from '../../../components/Modals/EditMemberModal';
import { getErrorMessage } from '../../../utils/errorHandler';

/**
 * Halaman Admin: Direktori User.
 * Menampilkan daftar member dengan fitur filter role (visual) dan akses CRUD.
 * - View Detail: Tersedia untuk semua user login.
 * - Create/Edit/Delete: HANYA untuk Superadmin.
 * * @component
 */
const UserList = () => {
    // --- STATE MANAGEMENT ---
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal Detail (View Only)
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberDetail | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    // Modal Edit (Admin Only)
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<MemberDetail | null>(null);

    // Current User Info (RBAC)
    const [currentUserRole, setCurrentUserRole] = useState<string>('');

    /**
     * Effect: Init Data
     */
    useEffect(() => {
        fetchData();

        // Cek Role User Login
        const userBox = localStorage.getItem('userBox');
        if (userBox) {
            try {
                const user = JSON.parse(userBox);
                setCurrentUserRole(user.role);
            } catch (e) {
                console.error("Gagal parse user role", e);
            }
        }
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        getMembers()
            .then(data => setMembers(data))
            .catch(err => console.error("Fetch Error:", err)) // Cukup console log, alert bikin annoying
            .finally(() => setIsLoading(false));
    };

    /**
     * Action: Delete Member
     */
    const handleDelete = async (id: number, username: string) => {
        if (!window.confirm(`PERINGATAN: Menghapus user "${username}" akan menghapus semua data terkait.\n\nLanjutkan?`)) return;
        try {
            await deleteMember(id);
            fetchData();
        } catch (error) {
            alert("GAGAL : " + getErrorMessage(error) );
        }
    };

    /**
     * Action: Open Detail Modal
     */
    const handleOpenDetail = async (id: number) => {
        setIsDetailOpen(true);
        setIsDetailLoading(true);
        setSelectedMember(null);
        try {
            const detail = await getMemberDetail(id);
            setSelectedMember(detail);
        } catch (error) {
            alert("Gagal memuat detail: " + getErrorMessage(error));
            setIsDetailOpen(false);
        } finally {
            setIsDetailLoading(false);
        }
    };

    /**
     * Action: Open Edit Modal
     */
    const handleOpenEdit = async (id: number) => {
        try {
            // Ambil data terbaru sebelum edit agar form terisi benar
            const detail = await getMemberDetail(id);
            setMemberToEdit(detail);
            setIsEditOpen(true);
        } catch (error) {
            alert("Gagal memuat data edit: " + getErrorMessage(error));
        }
    };

    // Helper: Role Badge Style
    const getRoleBadge = (role: string) => {
        const styles: Record<string, { bg: string, color: string }> = {
            superadmin: { bg: '#dc2626', color: 'white' },
            editor: { bg: '#2563eb', color: 'white' },
            creative: { bg: '#d97706', color: 'white' },
            member: { bg: '#475569', color: '#e2e8f0' }
        };
        const style = styles[role] || styles.member;

        return (
            <span style={{
                backgroundColor: style.bg,
                color: style.color,
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
            }}>
                {role}
            </span>
        );
    };

    return (
        <div style={{ color: '#e2e8f0' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Directory Members</h2>

                {/* Tombol Tambah (RBAC Check) */}
                {currentUserRole === 'superadmin' && (
                    <Link to="/dashboard/users/create" style={{
                        backgroundColor: '#fbbf24',
                        color: '#0f172a',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        + Tambah Member
                    </Link>
                )}
            </div>

            {/* Table */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: 16, textAlign: 'left' }}>Username</th>
                            <th style={{ padding: 16, textAlign: 'left' }}>Role</th>
                            <th style={{ padding: 16, textAlign: 'left' }}>Chapter</th>
                            <th style={{ padding: 16, textAlign: 'center' }}>Gen</th>
                            <th style={{ padding: 16, textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Memuat direktori...</td></tr>
                        ) : members.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Belum ada member terdaftar.</td></tr>
                        ) : (
                            members.map((m) => (
                                <tr key={m.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: 16, fontWeight: 'bold' }}>{m.username}</td>
                                    <td style={{ padding: 16 }}>{getRoleBadge(m.role)}</td>
                                    <td style={{ padding: 16, color: '#cbd5e1' }}>{m.chapter_name || '-'}</td>
                                    <td style={{ padding: 16, textAlign: 'center', fontFamily: 'monospace' }}>{m.generation}</td>
                                    <td style={{ padding: 16, textAlign: 'right' }}>

                                        {/* DETAIL BUTTON */}
                                        <button
                                            onClick={() => handleOpenDetail(m.id)}
                                            style={{ marginRight: 8, backgroundColor: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                                        >
                                            Detail
                                        </button>

                                        {/* ADMIN ACTIONS */}
                                        {currentUserRole === 'superadmin' && (
                                            <>
                                                <button
                                                    onClick={() => handleOpenEdit(m.id)}
                                                    style={{ marginRight: 8, backgroundColor: 'transparent', border: '1px solid #fbbf24', color: '#fbbf24', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(m.id, m.username)}
                                                    style={{ backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
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
            </div>

            {/* MODALS */}
            <UserDetailModal
                isOpen={isDetailOpen}
                isLoading={isDetailLoading}
                member={selectedMember}
                onClose={() => setIsDetailOpen(false)}
            />

            {currentUserRole === 'superadmin' && (
                <EditMemberModal
                    isOpen={isEditOpen}
                    member={memberToEdit}
                    onClose={() => setIsEditOpen(false)}
                    onSuccess={fetchData}
                />
            )}
        </div>
    );
};

export default UserList;