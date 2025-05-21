import React, { useState } from 'react';

export default function TodoForm({ onSave, onCancel, initialData = {} }) {
  const [title, setTitle] = useState(initialData ? initialData.title : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...initialData, title });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
