import { useInView } from 'react-intersection-observer';
import styles from './RevealWrapper.module.css';

interface RevealWrapperProps {
    children: React.ReactNode;
    className?: string; // Untuk menerima styling tambahan dari parent
}

export const RevealWrapper = ({ children, className = '' }: RevealWrapperProps) => {
    // Threshold bisa dijadikan prop opsional ke depannya jika butuh fleksibilitas
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <div 
            ref={ref} 
            // Gabungkan class bawaan (reveal + active) dengan class dari parent
            className={`${styles.revealBase} ${inView ? styles.active : ''} ${className}`}
        >
            {children}
        </div>
    );
};