import React from 'react';
import styles from './ButtonCarousel.module.css';

interface ButtonCarouselProps {
    direction?: 'left' | 'right';
    onClick?: () => void;
}

const ButtonCarousel: React.FC<ButtonCarouselProps> = ({
    direction = 'left',
    onClick
}) => {
    const isLeft = direction === 'left';
    const buttonClass = `${styles.btnCstm} ${isLeft ? styles.btnCstmLeft : styles.btnCstmRight}`;

    return (
        <button className={buttonClass} onClick={onClick}>
            <div className={styles.wrap}>
                <span></span>
                <div className={isLeft ? styles.leftArrow : styles.rightArrow}></div>
            </div>
        </button>
    );
};

export default ButtonCarousel;