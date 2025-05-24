import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, error = '', className = '' }) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <input
      className={`${styles.searchInput} ${error ? styles.invalid : ''}`}
      placeholder="Search by id or title…"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}