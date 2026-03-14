// client/src/pages/admin/Dasboard/index.tsx
import { useEffect, useState, type ReactNode } from 'react';
import { FaUsers, FaMapLocationDot, FaNewspaper, FaBookOpen, FaImages, FaVideo } from 'react-icons/fa6';
import { getDashboardStats } from '../../../services/dashboardService';

// --- 1. DEFINISI INTERFACE TIPE DATA ---
interface DashboardStats {
    members: number;
    chapters: number;
    articles: number;
    fanzines: number;
    albums: number;
    videos: number;
}

interface StatCardProps {
    title: string;
    count: number | string;
    icon: ReactNode;
    color: string;
    isLoading: boolean;
}

interface UserData {
    username: string;
    role: string;
}

// --- 2. PINDAHKAN HELPER COMPONENT KE LUAR ---
// Wajib di luar agar tidak di-recreate terus-menerus saat Dashboard re-render
const StatCard = ({ title, count, icon, color, isLoading }: StatCardProps) => (
    <div style={{
        backgroundColor: '#1e293b', 
        padding: '24px', 
        borderRadius: '12px',
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #334155'
    }}>
        <div style={{
            width: '60px', height: '60px', borderRadius: '12px',
            backgroundColor: `${color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color, fontSize: '1.8rem'
        }}>
            {icon}
        </div>
        <div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</div>
            <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
                {isLoading ? '...' : count}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    // --- 3. STATE DENGAN TIPE YANG KETAT ---
    const [user, setUser] = useState<UserData | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        members: 0, chapters: 0, articles: 0, fanzines: 0, albums: 0, videos: 0
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('userBox');
        if (userData) setUser(JSON.parse(userData));

        getDashboardStats()
            .then(data => setStats(data))
            .catch(err => console.error("Gagal load stats:", err))
            .finally(() => setIsLoadingStats(false));
    }, []);

    return (
        <div style={{ color: '#e2e8f0', padding: '30px' }}>
            
            {/* WELCOME BANNER */}
            <div style={{ marginBottom: '40px', borderBottom: '1px solid #334155', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', marginBottom: '5px' }}>Dashboard Overview</h2>
                    {user && (
                        <p style={{ color: '#94a3b8', margin: 0 }}>
                            Selamat datang kembali, <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{user.username}</span>! (Role: {user.role})
                        </p>
                    )}
                </div>
            </div>

            {/* STATISTIK GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {/* Tambahkan prop isLoading ke StatCard */}
                <StatCard isLoading={isLoadingStats} title="Total Members" count={stats.members} icon={<FaUsers />} color="#3b82f6" />
                <StatCard isLoading={isLoadingStats} title="Chapters" count={stats.chapters} icon={<FaMapLocationDot />} color="#10b981" />
                <StatCard isLoading={isLoadingStats} title="Articles" count={stats.articles} icon={<FaNewspaper />} color="#f59e0b" />
                <StatCard isLoading={isLoadingStats} title="Fanzines" count={stats.fanzines} icon={<FaBookOpen />} color="#ec4899" />
                <StatCard isLoading={isLoadingStats} title="Albums" count={stats.albums} icon={<FaImages />} color="#8b5cf6" />
                <StatCard isLoading={isLoadingStats} title="Videos" count={stats.videos} icon={<FaVideo />} color="#ef4444" />
            </div>

            {/* INFO TAMBAHAN */}
            <div style={{ background: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
                <h3 style={{ color: 'white', marginTop: 0 }}>📌 Quick Start Guide</h3>
                <p style={{ lineHeight: '1.6', color: '#94a3b8' }}>
                    Silakan pilih menu di sebelah kiri untuk mulai mengelola konten website. 
                    Gunakan menu <strong>My Profile</strong> untuk mengubah data diri dan password.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;