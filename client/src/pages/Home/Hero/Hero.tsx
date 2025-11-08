// client/src/Home/Hero.tsx
import styles from './Hero.module.css';
import logo from '../../../assets/logo/logo_flag.png';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <h1 className={styles.title}>
                Campus B
                <img src={logo} alt="logo" className={styles.logoInText} />
                ys 1976
            </h1>
            <p className={styles.subtitle}>PSS Sleman our way of Life</p>

        </section>
    );
}

export default Hero;