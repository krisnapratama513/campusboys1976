// client/src/components/NavBar/NavBar.tsx

import { Link } from "react-router-dom";
import styles from './NavBar.module.css';

import logoSrc from '../../assets/logo/logo.png';

const Navbar = () => {
    return (
        <nav className={styles.navBar}>
            <Link to={'/'} className={styles.logoLink}>
                <img
                    src={logoSrc}
                    alt="CampusBoys1976 Logo"
                    className={styles.logoImg}
                />
            </Link>

            <ul className={styles.navLink}>
                <li>
                    <Link to={'/'} className={styles.navItem}>Home</Link>
                </li>

                <li className={styles.dropdown}>
                    <button type="button" className={styles.navItem}>
                        Media
                    </button>
                    <ul className={styles.dropdownMenu}>
                        <li><Link to={'/photo'}>Photo</Link></li>
                        <li><Link to={'/video'}>Video</Link></li>
                    </ul>
                </li>
                <li className={styles.dropdown}>
                    <button type="button" className={styles.navItem}>
                        Post
                    </button>
                    <ul className={styles.dropdownMenu}>
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
