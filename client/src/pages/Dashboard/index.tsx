import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ username: string, role: string } | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('userBox');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userBox');
        navigate('/member');
    };

    return (
        <div style={{ padding: '100px 20px', minHeight: '60vh', textAlign: 'center', color: 'white' }}>
            <h1>Dashboard Area 🔒</h1>
            {user && <h3>Selamat datang, {user.username} ({user.role})</h3>}
            <button
                onClick={handleLogout}
                style={{ marginTop: '20px', padding: '10px 20px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;