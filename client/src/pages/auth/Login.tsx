// client/src/pages/auth/Login.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Untuk pindah halaman
import styles from './Login.module.css';

// Import URL backend
// import { API_BASE_URL } from '../../config/api';
import { API_BASE_URL } from '../../config/api';

const Login = () => {
    const navigate = useNavigate();

    // 1. STATE: Penampung data inputan user
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // 2. UI STATE: Untuk loading dan pesan error
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // 3. LOGIC: Saat tombol "Sign in" ditekan
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah reload halaman

        setIsLoading(true);
        setErrorMessage(''); // Reset error lama
        // alert(password);

        try {
            // Tembak API Backend
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            // Jika Gagal (misal: password salah)
            if (!response.ok) {
                throw new Error(result.message || 'Gagal login ke server');
            }

            // JIKA SUKSES:
            // A. Simpan "Surat Jalan" (Token) ke kantong browser (LocalStorage)
            localStorage.setItem('accessToken', result.data.token);

            // B. Simpan data user (opsional, untuk tampilkan nama di navbar)
            localStorage.setItem('userBox', JSON.stringify({
                username: result.data.username,
                role: result.data.role
            }));

            // C. Beri notifikasi kecil (opsional)
            // alert(`Selamat datang, ${result.data.username}!`);

            // D. Pindah ke halaman Dashboard (Area Admin)
            navigate('/dashboard');

        } catch (error: any) {
            console.error("Login Error:", error);
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false); // Matikan loading dalam kondisi apapun
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1>Sign in</h1>
                    </div>

                    {/* Tampilkan Error Box jika ada error */}
                    {errorMessage && (
                        <div style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            padding: '10px',
                            borderRadius: '6px',
                            marginBottom: '15px',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            {errorMessage}
                        </div>
                    )}

                    <form className={styles.form} onSubmit={handleLogin}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} // Update state saat ngetik
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="pass">Password</label>
                            <input
                                type="password"
                                id="pass"
                                placeholder="•••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Update state saat ngetik
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.btnPrimary}
                            disabled={isLoading} // Tombol mati saat loading
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