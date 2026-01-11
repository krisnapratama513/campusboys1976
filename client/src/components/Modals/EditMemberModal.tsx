import React, { useState, useEffect } from 'react';
import { getChapters } from '../../services/chapterService';
import { updateMemberByAdmin } from '../../services/userService';
import type { MemberDetail } from '../../types/user.types';
import type { Chapter } from '../../types/chapter.types';

interface EditMemberModalProps {
    isOpen: boolean;
    member: MemberDetail | null; // Data member yg mau diedit
    onClose: () => void;
    onSuccess: () => void; // Refresh tabel setelah sukses
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, member, onClose, onSuccess }) => {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [formData, setFormData] = useState({
        role: 'member',
        chapter_id: 0,
        generation: 8
    });
    const [isLoading, setIsLoading] = useState(false);

    // Load Data Awal
    useEffect(() => {
        if (isOpen && member) {
            setFormData({
                role: member.role,
                chapter_id: member.chapter_id,
                generation: member.generation
            });
            // Load list chapter buat dropdown
            getChapters().then(setChapters).catch(console.error);
        }
    }, [isOpen, member]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!member) return;
        
        setIsLoading(true);
        try {
            await updateMemberByAdmin(member.id, {
                role: formData.role,
                chapter_id: Number(formData.chapter_id),
                generation: Number(formData.generation)
            });
            alert('Data member berhasil diupdate!');
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: 'white' };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%', position: 'relative' }}>
                <h3 style={{ color: 'white', marginTop: 0 }}>Edit Akses Member</h3>
                
                <form onSubmit={handleSubmit}>
                    {/* Role */}
                    <label style={{ display: 'block', color:'#94a3b8', marginBottom: 5 }}>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
                        <option value="member">Member</option>
                        <option value="creative">Creative Team</option>
                        <option value="editor">Editor</option>
                        <option value="superadmin">Superadmin</option>
                    </select>

                    {/* Chapter */}
                    <label style={{ display: 'block', color:'#94a3b8', marginBottom: 5 }}>Chapter</label>
                    <select name="chapter_id" value={formData.chapter_id} onChange={handleChange} style={inputStyle}>
                        {chapters.map(ch => (
                            <option key={ch.id} value={ch.id}>{ch.name}</option>
                        ))}
                    </select>

                    {/* Generasi */}
                    <label style={{ display: 'block', color:'#94a3b8', marginBottom: 5 }}>Generasi</label>
                    <select name="generation" value={formData.generation} onChange={handleChange} style={inputStyle}>
                        {Array.from({ length: 13 }, (_, i) => i + 1).map(g => (
                            <option key={g} value={g}>Gen {g}</option>
                        ))}
                    </select>

                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button type="submit" disabled={isLoading} style={{ flex: 1, padding: 10, background: '#fbbf24', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button type="button" onClick={onClose} style={{ padding: '10px 20px', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMemberModal;