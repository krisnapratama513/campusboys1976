// client/src/components/Footer/Footer.tsx

import styles from './Footer.module.css';
import { FaXTwitter, FaInstagram, FaYoutube, FaSpotify, FaEnvelope, FaApple } from 'react-icons/fa6';
import logoSrc from '../../assets/logo/logo.png';


const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            {/* Kolom Kiri: Logo & Slogan */}
            <div className={styles.footerColumnLeft}>
                <img
                    src={logoSrc}
                    alt="CAMPUSBOYS1976 Logo"
                    className={styles.footerLogo}
                />
                <p className={styles.footerSlogan}>
                    Kuliah, Kudukung, Kubanggakan
                </p>
            </div>

            {/* Kolom Kanan: Ikon Sosial Media */}
            <div className={styles.footerColumnRight}>
                <a href="mailto:backupcampusboys@gmail.com" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                    <FaEnvelope />
                </a>
                <a href="https://x.com/CampusBoys1976" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                    <FaXTwitter />
                </a>
                <a href="https://instagram.com/username" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                    <FaInstagram />
                </a>
                <a href="https://www.youtube.com/@slemancampusboys2000" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                    <FaYoutube />
                </a>
                <a href="https://open.spotify.com/artist/0O8mZ7TDSZRYk47QQPN5sB?si=6RlcWXtFTGSPBqtV-Zjr5A" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                    <FaSpotify />
                </a>
                <a href="https://music.apple.com/id/artist/campusboys-1976/1578628995?l=id" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                    <FaApple />
                </a>
            </div>

            {/* Baris Bawah: Copyright (terpisah agar mudah responsif) */}
            <div className={styles.footerCopyright}>
                <p>&copy; 2025 CAMPUSBOYS1976.</p>
            </div>
        </footer>
    );
};

export default Footer;