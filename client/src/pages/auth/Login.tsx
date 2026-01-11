import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; // Menggunakan CSS Anda

// Best Practice: Import URL API dari config agar mudah dikelola
import { API_BASE_URL } from '../../config/api';

const Login = () => {
    // Hooks: Standar React untuk navigasi
    const navigate = useNavigate();

    // 1. STATE MANAGEMENT
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // 2. HANDLER LOGIC
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah reload halaman

        setIsLoading(true);
        setErrorMessage('');

        try {
            // API Request
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            // Validasi Respon
            if (!response.ok) {
                throw new Error(result.message || 'Gagal login ke server');
            }

            // --- [CRITICAL UPDATE] --- 
            // SUCCESS HANDLING:
            
            // A. Simpan Token untuk otentikasi request selanjutnya
            localStorage.setItem('accessToken', result.data.token);

            // B. Simpan DATA USER LENGKAP (Termasuk ID, Chapter, Gen)
            // Ini yang memperbaiki error "undefined" di halaman profil
            localStorage.setItem('userBox', JSON.stringify(result.data));

            // C. Redirect ke Dashboard
            navigate('/dashboard');

        } catch (error: any) {
            console.error("Login Error:", error);
            setErrorMessage(error.message || "Terjadi kesalahan koneksi.");
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1>Sign in</h1>
                    </div>

                    {/* Menampilkan pesan error jika ada */}
                    {errorMessage && (
                        <div className={styles.errorBox}>
                            {errorMessage}
                        </div>
                    )}

                    <form className={styles.form} onSubmit={handleLogin}>
                        {/* Input Username */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                placeholder="Masukkan username"
                            />
                        </div>

                        {/* Input Password */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="pass">Password</label>
                            <input
                                type="password"
                                id="pass"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                placeholder="•••••••"
                            />
                        </div>

                        {/* Tombol Submit */}
                        <button
                            type="submit"
                            className={styles.btnPrimary}
                            disabled={isLoading}
                            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                        >
                            {isLoading ? 'Memproses...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;