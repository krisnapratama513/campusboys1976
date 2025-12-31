// import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
import styles from './AboutSection.module.css';

function AboutSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
    // Tentukan threshold berdasarkan ukuran layar
    const getThreshold = () => {
        if (window.innerWidth <= 480) return 0.05;
        if (window.innerWidth <= 768) return 0.1;
        return 0.2;
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.visible);
                }
            });
        },
        { threshold: getThreshold() }
    );

    if (sectionRef.current) {
        observer.observe(sectionRef.current);
    }

    return () => {
        if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
        }
    };
}, []);

    return (
        <section className={styles.container} ref={sectionRef}>

            <h2 className={styles.sectionTitle}>
                About us
            </h2>

            <p className={styles.text}>
                Sepakbola bagi sebagian orang sudah dianggap sebagai agama, sesuatu yang begitu suci dan vital pada
                masing-masing tempatnya. Namun kami ingin memandang sepakbola sebagai suatu hal dalam pengertian
                yang lebih sederhana, sebagai kebahagiaan. Ya, sepakbola sebagai kebahagiaan, suatu hal yang yang
                harus dirayakan dan disyukuri kapan saja. Meskipun kami menempatkan pengertian sepakbola dalam hal
                yang paling sederhana, di lain tempat kami menjunjungnya sebagai hal agung, bak valhalla, valkuntha,
                atau surga, yang dengan begitu sepakbola mendapat tempat tersendiri di hati kami. Percaya atau
                tidak, sepakbola bagi kami tak akan pernah selesai hanya dengan 90 menit, ia abadi, ada dalam setiap
                perjalanan hidup kami, begitulah kami memaknai sepakbola sebagai cinta dan kebahagiaan.
            </p>

            <a href="/about" className={styles.link}>
                Read More &rarr;
            </a>
        </section>
    );
}

export default AboutSection;




