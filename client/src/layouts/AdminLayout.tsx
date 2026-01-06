// client/src/layouts/AdminLayout.tsx

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    
    // State menu dropdown
    const [openMenus, setOpenMenus] = useState({
        chapters: false,
        authors: false,
        fanzines: false, // Saya ganti nama key jadi 'fanzines' biar konsisten
        articles: false,
        albums: false,
        videos: false
    });

    const toggleMenu = (menuKey: keyof typeof openMenus) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }));
    };

    const handleLogout = () => {
        // Hapus session
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userBox');
        navigate('/member');
    };

    return (
        <div className={styles.container}>
            {/* HEADER */}
            <header className={styles.header}>
                <div className={styles.logo}>ADMIN DASHBOARD</div>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                </button>
            </header>

            <div className={styles.body}>
                {/* SIDEBAR */}
                <aside className={styles.sidebar}>
                    <nav>
                        {/* 1. DASHBOARD HOME */}
                        <NavLink 
                            to="/dashboard" 
                            end 
                            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
                        >
                            📊 Dashboard Overview
                        </NavLink>

                        <div className={styles.sectionHeader}>MANAGEMENT</div>

                        {/* === MENU 1: CHAPTERS === */}
                        {/* (Biarkan jika belum ada fitur) */}
                        <button className={styles.dropdownBtn} onClick={() => toggleMenu('chapters')}>
                            <span>📑 Chapters</span>
                            <span className={`${styles.arrow} ${openMenus.chapters ? styles.arrowOpen : ''}`}>▼</span>
                        </button>
                        {openMenus.chapters && (
                            <div className={styles.submenu}>
                                <NavLink to="/dashboard/chapters" end className={styles.subLink}>👁️ Lihat Data</NavLink>
                                <NavLink to="/dashboard/chapters/create" className={styles.subLink}>➕ Tambah Chapter</NavLink>
                            </div>
                        )}

                        {/* === MENU 2: AUTHORS === */}
                        <button className={styles.dropdownBtn} onClick={() => toggleMenu('authors')}>
                            <span>✍️ Authors</span>
                            <span className={`${styles.arrow} ${openMenus.authors ? styles.arrowOpen : ''}`}>▼</span>
                        </button>
                        {openMenus.authors && (
                            <div className={styles.submenu}>
                                <NavLink to="/dashboard/authors" end className={styles.subLink}>👁️ Lihat Author</NavLink>
                                <NavLink to="/dashboard/authors/create" className={styles.subLink}>➕ Tambah Author</NavLink>
                            </div>
                        )}

                        {/* === MENU 3: FANZINES (Update Path Disini!) === */}
                        <button className={styles.dropdownBtn} onClick={() => toggleMenu('fanzines')}>
                            <span>📰 Fanzines</span>
                            <span className={`${styles.arrow} ${openMenus.fanzines ? styles.arrowOpen : ''}`}>▼</span>
                        </button>
                        {openMenus.fanzines && (
                            <div className={styles.submenu}>
                                {/* Pastikan path ini sesuai route di App.tsx */}
                                <NavLink to="/dashboard/fanzines" end className={styles.subLink}>
                                    👁️ Lihat Fanzines
                                </NavLink>
                                <NavLink to="/dashboard/fanzines/create" className={styles.subLink}>
                                    ➕ Upload Fanzine
                                </NavLink>
                            </div>
                        )}

                        {/* === MENU 4: ARTICLES === */}
                        <button className={styles.dropdownBtn} onClick={() => toggleMenu('articles')}>
                            <span>📝 Articles</span>
                            <span className={`${styles.arrow} ${openMenus.articles ? styles.arrowOpen : ''}`}>▼</span>
                        </button>
                        {openMenus.articles && (
                            <div className={styles.submenu}>
                                <NavLink to="/dashboard/articles" end className={styles.subLink}>👁️ Lihat Artikel</NavLink>
                                <NavLink to="/dashboard/articles/create" className={styles.subLink}>➕ Tulis Artikel</NavLink>
                            </div>
                        )}

                        {/* ... Menu Albums & Videos biarkan dulu ... */}

                        <div className={styles.sectionHeader}>SYSTEM</div>
                        
                        <NavLink 
                            to="/dashboard/users" 
                            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
                        >
                            👥 User Manager
                        </NavLink>

                    </nav>
                </aside>

                {/* CONTENT AREA */}
                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;