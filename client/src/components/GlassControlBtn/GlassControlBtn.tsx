import styles from './GlassControlBtn.module.css'
import { FaChevronLeft, FaChevronRight, FaXmark } from 'react-icons/fa6';


interface GlassControlBtnProps {
    varian?: 'left' | 'right' | 'close';
    onClick?: () => void;
}

const GlassControlBtn: React.FC<GlassControlBtnProps> = ({
    varian = 'left',
    onClick
}) => {

    // Mapping varian ke component Icon
    const iconMap = {
        left: <FaChevronLeft />,
        right: <FaChevronRight />,
        close: <FaXmark />
    };

    return (
        <button 
            className={styles.btnClass} 
            onClick={onClick}
            // Menambahkan aria-label untuk aksesibilitas (penting untuk button icon)
            aria-label={varian} 
            type="button"
        >
            {iconMap[varian]}
        </button>
    );
};

export default GlassControlBtn;