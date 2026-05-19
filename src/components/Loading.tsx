import styles from './dashboard.module.css';

export default function Loading() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p style={{ color: 'var(--text-secondary)' }}>Analyzing Portfolio Data...</p>
    </div>
  );
}
