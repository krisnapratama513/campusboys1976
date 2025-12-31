// client/src/pages/Member/index
import styles from './MemberPage.module.css';

const MemberPage = () => {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1>Sign in</h1>
                    </div>
                    <form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="pass">Password</label>
                            <input type="password" id="pass" placeholder="•••••••"  required/>
                        </div>

                        <button type="submit" className={styles.btnPrimary}>Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MemberPage;