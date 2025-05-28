import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, placeholder, className = '' }) {
  return (
    <div className={`${styles.searchInput} ${className ?? ''}`.trim()}>
      <input
      className={`${styles.searchInput}`}
      placeholder={`${placeholder || "Search…"}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      autoFocus
    />
    </div>
  );
}