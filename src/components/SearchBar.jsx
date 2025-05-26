import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, className = '' }) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <input
      className={`${styles.searchInput}`}
      placeholder="Search by title…"
      value={value}
      onChange={e => onChange(e.target.value)}
      autoFocus
    />
    </div>
  );
}