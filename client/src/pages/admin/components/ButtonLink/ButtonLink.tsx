// components/ButtonLink.tsx
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './button.module.css'
// import React from 'react'; // Pastikan React diimport jika belum

interface ButtonLinkProps extends LinkProps {
    icon?: React.ReactNode;
}

export const ButtonLink = ({ children, icon, className = '', ...props }: ButtonLinkProps) => {
    return (
        <Link
            {...props}
            // Hapus className='' jika tidak dipakai, atau biarkan untuk tambahan utility class
            className={styles.button}
        >
            {/* Jika ada icon, render di sini */}
            {icon && <span style={{ fontSize: '1.2em' }}>{icon}</span>}
            {children}
        </Link>
    );
};