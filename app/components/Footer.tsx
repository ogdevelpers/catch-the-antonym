import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.copyright}>
            <p>© {new Date().getFullYear()} Spell Bee. All rights reserved.</p>
          </div>
          {/* <div className={styles.info}>
            <span>⚡ 30-Second Challenge</span>
            <span className={styles.separator}>•</span>
            <span>🎯 Match the antonyms</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

