import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <h1 className={styles.title}>
              🔥 CATCH THE ANTONYM
            </h1>
            {/* <span className={styles.subtitle}>
              ADVANCED EDITION
            </span> */}
          </div>
          <div className={styles.rightSection}>
            Vocabulary Challenge
          </div>
        </div>
      </div>
    </header>
  );
}

