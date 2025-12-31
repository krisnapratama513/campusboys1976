import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [user, setUser] = useState<{ username: string, role: string } | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('userBox');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    return (
        <div>
            {/* Konten Dashboard Sederhana */}
            <h2 style={{ marginBottom: '20px' }}>Dashboard Overview</h2>
            
            {user && (
                <div style={{ 
                    background: '#1e293b', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    border: '1px solid #334155',
                    maxWidth: '600px'
                }}>
                    <h3 style={{ color: '#38bdf8' }}>Selamat Datang, {user.username}! 👋</h3>
                    <p style={{ marginTop: '10px', color: '#94a3b8' }}>
                        Anda login sebagai: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{user.role}</span>
                    </p>
                    <p style={{ marginTop: '20px', lineHeight: '1.6' }}>
                        Silakan pilih menu di sebelah kiri untuk mulai mengelola konten website Anda.
                    </p>
                </div>
            )}

            {/* Tombol Logout sudah dihapus dari sini karena sudah ada di Header Atas */}
        </div>
    );
};

export default Dashboard;