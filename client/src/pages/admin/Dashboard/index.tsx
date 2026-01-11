// client/src/pages/admin/Dasboard/index.tsx
import { useEffect, useState } from 'react';
import { FaUsers, FaMapLocationDot, FaNewspaper, FaBookOpen, FaImages, FaVideo } from 'react-icons/fa6';
import { getDashboardStats } from '../../../services/dashboardService';

const Dashboard = () => {
    // 1. STATE
    const [user, setUser] = useState<{ username: string, role: string } | null>(null);
    const [stats, setStats] = useState<any>({
        members: 0, chapters: 0, articles: 0, fanzines: 0, albums: 0, videos: 0
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    // 2. FETCH DATA
    useEffect(() => {
        // A. Load User Local (Kode Lama Anda)
        const userData = localStorage.getItem('userBox');
        if (userData) setUser(JSON.parse(userData));

        // B. Load Statistik dari Server (Fitur Baru)
        getDashboardStats()
            .then(data => setStats(data))
            .catch(err => console.error("Gagal load stats:", err))
            .finally(() => setIsLoadingStats(false));
    }, []);

    // 3. KOMPONEN KARTU (Helper)
    const StatCard = ({ title, count, icon, color }: any) => (
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
            {/* Icon Box */}
            <div style={{
                width: '60px', height: '60px', borderRadius: '12px',
                backgroundColor: `${color}20`, // Transparan 20%
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: color, fontSize: '1.8rem'
            }}>
                {icon}
            </div>
            {/* Text Info */}
            <div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</div>
                <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
                    {isLoadingStats ? '...' : count}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ color: '#e2e8f0' }}>
            
            {/* === BAGIAN 1: WELCOME BANNER (Kode Lama Dipercantik) === */}
            <div style={{ 
                marginBottom: '40px', 
                borderBottom: '1px solid #334155', 
                paddingBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end'
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', marginBottom: '5px' }}>
                        Dashboard Overview
                    </h2>
                    {user && (
                        <p style={{ color: '#94a3b8', margin: 0 }}>
                            Selamat datang kembali, <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{user.username}</span>! 
                            (Role: {user.role})
                        </p>
                    )}
                </div>
            </div>

            {/* === BAGIAN 2: STATISTIK GRID (Fitur Baru) === */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '20px',
                marginBottom: '40px'
            }}>
                {/* Baris 1: Komunitas */}
                <StatCard title="Total Members" count={stats.members} icon={<FaUsers />} color="#3b82f6" />
                <StatCard title="Chapters" count={stats.chapters} icon={<FaMapLocationDot />} color="#10b981" />
                
                {/* Baris 2: Editorial */}
                <StatCard title="Articles" count={stats.articles} icon={<FaNewspaper />} color="#f59e0b" />
                <StatCard title="Fanzines" count={stats.fanzines} icon={<FaBookOpen />} color="#ec4899" />
                
                {/* Baris 3: Creative */}
                <StatCard title="Albums" count={stats.albums} icon={<FaImages />} color="#8b5cf6" />
                <StatCard title="Videos" count={stats.videos} icon={<FaVideo />} color="#ef4444" />
            </div>

            {/* === BAGIAN 3: INFO TAMBAHAN === */}
            <div style={{ 
                background: '#1e293b', 
                padding: '25px', 
                borderRadius: '12px', 
                border: '1px solid #334155'
            }}>
                <h3 style={{ color: 'white', marginTop: 0 }}>📌 Quick Start Guide</h3>
                <p style={{ lineHeight: '1.6', color: '#94a3b8' }}>
                    Silakan pilih menu di sebelah kiri untuk mulai mengelola konten website Anda. 
                    Gunakan menu <strong>My Profile</strong> untuk mengubah data diri dan password.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;