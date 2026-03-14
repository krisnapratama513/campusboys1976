// client/src/pages/public/Home/components/ContentWrapper/index.tsx
import styles from './ContentWrapper.module.css';
import type { ReactNode } from 'react';

interface ContentWrapperProps {
    children: ReactNode;
}

const ContentWrapper = ({ children }: ContentWrapperProps) => {
    return (
        <div className={styles.contentWrapper}>
            {children}
        </div>
    );
};

export default ContentWrapper;