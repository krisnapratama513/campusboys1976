// client/src/pages/public/Home/components/HeroSection/index.tsx

import styles from './HeroSection.module.css';
import o from '../../../../../assets/logo/logo_flag.png';

const HeroSection = () => {
    return (
        <section className={styles.hero}>
            <h1 className={styles.title}>
                Campus B
                <img src={o} alt="o" className={styles.logoInText} />
                ys 1976
            </h1>
            <p className={styles.subtitle}>PSS Sleman our way of Life</p>

        </section>
    );
}

export default HeroSection;