// client/src/components/NavBar/NavBar.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import styles from './NavBar.module.css';

import logoSrc from '../../assets/logo/logo.png';
import { FaBars, FaXmark } from 'react-icons/fa6';

const Navbar = () => {
    // State untuk melacak status menu seluler
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Status menu hamburger
    const [isMediaOpen, setIsMediaOpen] = useState(false); // Status dropdown Media
    const [isPostOpen, setIsPostOpen] = useState(false); // Status dropdown Post

    // Fungsi untuk mengubah status menu
    const toggleMenu = () => {
        setIsMenuOpen(prev => {
            // Jika menu akan DITUTUP (prev=true), maka tutup sub-menu
            if (prev) {
                setIsMediaOpen(false);
                setIsPostOpen(false);
            }
            return !prev; // Kembalikan status toggle baru
        });
    };

    const toggleMedia = () => {
        setIsMediaOpen(!isMediaOpen);
        setIsPostOpen(false);
    };

    const togglePost = () => {
        setIsPostOpen(!isPostOpen);
        setIsMediaOpen(false);
    };
    return (
        <nav className={styles.navBar}>
            {/* Logo */}
            <Link to={'/'} className={styles.logoLink}>
                <img
                    src={logoSrc}
                    alt="CampusBoys1976 Logo"
                    className={styles.logoImg}
                />
            </Link>

            {/* Tombol Hamburger */}
            <button
                id="menu-toggle"
                className={`${styles.hamburgerButton}`}
                onClick={toggleMenu}
                aria-controls="nav-links"
                aria-expanded={isMenuOpen}
            >
                {isMenuOpen ? (
                    <FaXmark size={24} className={styles.iconX} /> // Tampilkan 'X' saat terbuka
                ) : (
                    <FaBars size={24} className={styles.iconBars} /> // Tampilkan 3 garis saat tertutup
                )}
            </button>

            {/* Navigasi Link */}
            <ul
                id="nav-links"
                className={`${styles.navLink} ${isMenuOpen ? styles.open : ''}`}
            >
                <li>
                    <Link to={'/'} className={styles.navItem}>Home</Link>
                </li>

                <li className={styles.dropdown}>
                    <button
                        type="button"
                        className={styles.navItem}
                        onClick={toggleMedia}
                    >
                        Media
                    </button>
                    <ul className={`${styles.dropdownMenu} ${isMediaOpen ? styles.mobileOpen : ''}`}>
                        <li><Link to={'/photo'}>Photo</Link></li>
                        <li><Link to={'/video'}>Video</Link></li>
                    </ul>
                </li>
                <li className={styles.dropdown}>
                    <button type="button" className={styles.navItem} onClick={togglePost}>
                        Post
                    </button>
                    <ul className={`${styles.dropdownMenu} ${isPostOpen ? styles.mobileOpen : ''}`}>
                        <li><Link to={'/article'}>Article</Link></li>
                        <li><Link to={'/magazine'}>Magazine</Link></li>
                    </ul>
                </li>
                <li>
                    <Link to={'/about'} className={styles.navItem}>About</Link>
                </li>
                <li>
                    <Link to={'/member'} className={styles.navItem}>Member</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;