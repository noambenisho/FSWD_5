import styles from './TodoForm.module.css';
import { useState } from 'react';

export default function TodoForm({ onSave, onCancel, initialData = {} }) {
  const [title, setTitle] = useState(initialData ? initialData.title : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...initialData, title });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />

      <div className={styles.actions}>
        <button className={styles.cancelBtn} type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.primaryBtn} type="submit">
          Save
        </button>
      </div>
    </form>
  );
}
