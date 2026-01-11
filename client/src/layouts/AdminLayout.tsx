// client/src/layouts/AdminLayout.tsx
import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styles from './AdminLayout.module.css';

// Import Config Permission tadi
import { PERMISSIONS, hasAccess } from '../config/permissions';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<string>('');

    // State Menu (Sama seperti sebelumnya)
    const [openMenus, setOpenMenus] = useState({
        chapters: false,
        members: false,
        authors: false,
        fanzines: false,
        articles: false,
        albums: false,
        videos: false
    });

    // Load Role saat layout dimuat
    useEffect(() => {
        const userBox = localStorage.getItem('userBox');
        if (userBox) {
            const user = JSON.parse(userBox);
            setUserRole(user.role);
        } else {
            navigate('/member'); // Kalau gak login, tendang keluar
        }
    }, [navigate]);

    const toggleMenu = (menuKey: keyof typeof openMenus) => {
        setOpenMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userBox');
        navigate('/member');
    };

    // Helper Styles NavLink
    const getLinkClass = ({ isActive }: any) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>ADMIN DASHBOARD</div>
                <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </header>

            <div className={styles.body}>
                <aside className={styles.sidebar}>
                    <nav>
                        {/* 1. DASHBOARD (Semua Bisa Akses) */}
                        <NavLink to="/dashboard" end className={getLinkClass}>
                            📊 Dashboard Overview
                        </NavLink>

                        <div className={styles.sectionHeader}>MANAGEMENT</div>

                        {/* 2. CHAPTERS (Hanya Superadmin) */}
                        {hasAccess(userRole, PERMISSIONS.CAN_MANAGE_CHAPTERS) && (
                            <>
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
                            </>
                        )}

                        {/* 3. MEMBERS (Semua Bisa LIHAT, tapi menu 'Create' dibatasi di route) */}
                        {hasAccess(userRole, PERMISSIONS.CAN_VIEW_USERS) && (
                            <>
                                <button className={styles.dropdownBtn} onClick={() => toggleMenu('members')}>
                                    <span>👥 Members</span>
                                    <span className={`${styles.arrow} ${openMenus.members ? styles.arrowOpen : ''}`}>▼</span>
                                </button>
                                {openMenus.members && (
                                    <div className={styles.submenu}>
                                        <NavLink to="/dashboard/users" end className={styles.subLink}>
                                            👁️ Directory List
                                        </NavLink>
                                        
                                        {/* Link Tambah Member HANYA muncul buat Superadmin */}
                                        {hasAccess(userRole, PERMISSIONS.CAN_MANAGE_USERS) && (
                                            <NavLink to="/dashboard/users/create" className={styles.subLink}>
                                                ➕ Tambah Member
                                            </NavLink>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* 4. CONTENT GROUP (Authors, Fanzines, Articles) - EDITOR & SUPERADMIN */}
                        {hasAccess(userRole, PERMISSIONS.CAN_MANAGE_EDITORIAL) && (
                            <>
                                {/* AUTHORS */}
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

                                {/* FANZINES */}
                                <button className={styles.dropdownBtn} onClick={() => toggleMenu('fanzines')}>
                                    <span>📰 Fanzines</span>
                                    <span className={`${styles.arrow} ${openMenus.fanzines ? styles.arrowOpen : ''}`}>▼</span>
                                </button>
                                {openMenus.fanzines && (
                                    <div className={styles.submenu}>
                                        <NavLink to="/dashboard/fanzines" end className={styles.subLink}>👁️ Lihat Fanzines</NavLink>
                                        <NavLink to="/dashboard/fanzines/create" className={styles.subLink}>➕ Upload Fanzine</NavLink>
                                    </div>
                                )}

                                {/* ARTICLES */}
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
                            </>
                        )}

                        {/* 5. CREATIVE GROUP (Albums, Videos) - CREATIVE & SUPERADMIN */}
                        {hasAccess(userRole, PERMISSIONS.CAN_MANAGE_CREATIVE) && (
                            <>
                                {/* ALBUMS */}
                                <button className={styles.dropdownBtn} onClick={() => toggleMenu('albums')}>
                                    <span>📸 Albums</span>
                                    <span className={`${styles.arrow} ${openMenus.albums ? styles.arrowOpen : ''}`}>▼</span>
                                </button>
                                {openMenus.albums && (
                                    <div className={styles.submenu}>
                                        <NavLink to="/dashboard/albums" end className={styles.subLink}>👁️ Lihat Album</NavLink>
                                        <NavLink to="/dashboard/albums/create" className={styles.subLink}>➕ Buat Album</NavLink>
                                    </div>
                                )}

                                {/* VIDEOS */}
                                <button className={styles.dropdownBtn} onClick={() => toggleMenu('videos')}>
                                    <span>🎬 Videos</span>
                                    <span className={`${styles.arrow} ${openMenus.videos ? styles.arrowOpen : ''}`}>▼</span>
                                </button>
                                {openMenus.videos && (
                                    <div className={styles.submenu}>
                                        <NavLink to="/dashboard/videos" end className={styles.subLink}>👁️ Lihat Video</NavLink>
                                        <NavLink to="/dashboard/videos/create" className={styles.subLink}>➕ Tambah Video</NavLink>
                                    </div>
                                )}
                            </>
                        )}

                        <div className={styles.sectionHeader}>SYSTEM</div>
                        
                        {/* MY PROFILE (Semua Bisa Akses) */}
                        <NavLink to="/dashboard/profile" className={getLinkClass}>
                            ⚙️ My Profile
                        </NavLink>

                    </nav>
                </aside>

                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;