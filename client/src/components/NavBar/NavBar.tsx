// client/src/components/NavBar/NavBar.tsx

import { Link } from "react-router-dom";
import styles from './NavBar.module.css';
import useNavMenu from "../../hooks/useNavMenu";
import NavDropdown from "./NavDropdown";

import logoSrc from '../../assets/logo/logo.png';
import { FaBars, FaXmark } from 'react-icons/fa6';


/**
 * @component Navbar
 * @description Komponen utama bilah navigasi (Navigation Bar).
 * Mengelola tampilan logo, tautan utama, dropdown menu, dan tombol hamburger.
 */
const Navbar = () => {
    /**
     * @hook useNavMenu
     * Mengambil state dan fungsi toggle untuk mengelola menu navigasi.
     * Termasuk menu utama (mobile) dan kedua dropdown (Media, Post).
     */
    const {
        isMenuOpen,     // State: Apakah menu navigasi utama (mobile) terbuka?
        isMediaOpen,    // State: Apakah dropdown Media terbuka?
        isPostOpen,     // State: Apakah dropdown Post terbuka?
        toggleMenu,     // Handler: Mengubah state isMenuOpen
        toggleMedia,    // Handler: Mengubah state isMediaOpen
        togglePost,     // Handler: Mengubah state isPostOpen
        closeAllMenus   // Handler: Menutup semua menu dan dropdown
    } = useNavMenu();

    /**
     * @constant mediaLinks
     * Data tautan yang akan dilewatkan ke komponen NavDropdown untuk 'Media'.
     */
    const mediaLinks = [
        { to: '/photo', label: 'Photo' },
        { to: '/video', label: 'Video' },
    ];

    /**
     * @constant postLinks
     * Data tautan yang akan dilewatkan ke komponen NavDropdown untuk 'Post'.
     */
    const postLinks = [
        { to: '/article', label: 'Article' },
        { to: '/fanzine', label: 'Fanzine' },
    ];

    return (
        // Navigasi utama dengan gaya CSS module
        <nav className={styles.navBar}>
            {/* Logo - Tautan ke Beranda */}
            <Link to={'/'} className={styles.logoLink}>
                <img
                    src={logoSrc}
                    alt="CampusBoys1976 Logo"
                    className={styles.logoImg}
                />
            </Link>

            {/* Tombol Hamburger (Hanya terlihat di Mobile) */}
            <button
                id="menu-toggle"
                className={`${styles.hamburgerButton}`}
                onClick={toggleMenu}
                aria-controls="nav-links"
                aria-expanded={isMenuOpen}
            >
                {/* Menampilkan ikon 'X' saat terbuka, atau ikon 3 garis saat tertutup */}
                {isMenuOpen ? (
                    <FaXmark size={24} className={styles.iconX} /> // Tampilkan 'X' saat terbuka
                ) : (
                    <FaBars size={24} className={styles.iconBars} /> // Tampilkan 3 garis saat tertutup
                )}
            </button>

            {/* Daftar Tautan Navigasi */}
            <ul
                id="nav-links"
                // Menambahkan class 'open' jika isMenuOpen true (untuk transisi mobile)
                className={`${styles.navLink} ${isMenuOpen ? styles.open : ''}`}
            >
                {/* Tautan Statis: Home */}
                <li>
                    <Link to={'/'} className={styles.navItem} onClick={closeAllMenus}>Home</Link>
                </li>

                {/* Dropdown Media */}
                <NavDropdown
                    title="Media"
                    links={mediaLinks}
                    isOpen={isMediaOpen}
                    onToggle={toggleMedia}
                    onLinkClick={closeAllMenus}
                />

                {/* Dropdown Post */}
                <NavDropdown
                    title="Post"
                    links={postLinks}
                    isOpen={isPostOpen}
                    onToggle={togglePost}
                    onLinkClick={closeAllMenus}
                />

                {/* Tautan Statis: About */}
                <li>
                    <Link to={'/about'} className={styles.navItem} onClick={closeAllMenus}>About</Link>
                </li>

                {/* Tautan Statis: Member */}
                <li>
                    <Link to={'/member'} className={styles.navItem} onClick={closeAllMenus}>Member</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;