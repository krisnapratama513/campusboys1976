// client/src/components/NavBar/NavDropdown.tsx

import { Link } from "react-router-dom";
import styles from './NavBar.module.css';
import React from "react";
import { FaAngleDown } from 'react-icons/fa6';


/**
 * @interface NavDropdownProps
 * Mendefinisikan properti (props) yang diterima oleh komponen NavDropdown.
 */
interface NavDropdownProps {
    /** Judul yang ditampilkan pada tombol dropdown utama. */
    title: string;
    /** Array tautan yang akan ditampilkan di dalam menu dropdown. */
    links: { to: string; label: string }[];
    /** State boolean yang menentukan apakah menu dropdown sedang terbuka atau tidak. */
    isOpen: boolean;
    /** Handler fungsi yang dipanggil saat tombol utama diklik (untuk mengubah state). */
    onToggle: () => void;
    /** Handler fungsi yang dipanggil saat tautan di dalam dropdown diklik (untuk menutup semua menu). */
    onLinkClick: () => void;
}


/**
 * @component NavDropdown
 * @description Komponen yang merepresentasikan item navigasi dengan submenu (dropdown).
 * Menerima state dan handler dari komponen induk (Navbar) dan hook (useNavMenu).
 * @param {NavDropdownProps} props Properti untuk dropdown.
 */
const NavDropdown: React.FC<NavDropdownProps> = ({ title, links, isOpen, onToggle, onLinkClick }) => {
    return (
        <li className={styles.dropdown}>
            {/* Tombol pemicu dropdown */}
            <button
                type="button"
                className={styles.navItem}
                onClick={onToggle}
            >
                {title}

                <FaAngleDown 
                    className={`${styles.dropdownArrow} ${isOpen ? styles.arrowUp : ''}`} 
                />
            </button>
            {/* Menu dropdown */}
            <ul className={`${styles.dropdownMenu} ${isOpen ? styles.mobileOpen : ''}`}>
                {links.map((link) => (
                    <li key={link.to}>
                        <Link to={link.to} onClick={onLinkClick}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </li>
    );
};

export default NavDropdown;