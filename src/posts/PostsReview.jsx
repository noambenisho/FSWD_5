import { Link, useNavigate } from 'react-router-dom';
import { useState }   from 'react';
import { usePosts } from './PostsLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { PostsService } from '../api/PostsService.js';
import SearchBar from '../components/SearchBar.jsx';
import styles from './PostsReview.module.css';

export default function PostsReview() {
  const nav = useNavigate();
  const { activeUser } = useAuth();
  const {
    posts, setPosts,
    selectedId, setSelectedId,
    search, setSearch, setError
  } = usePosts();

   // States for the inline “new post” form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [searchError, setSearchError] = useState('');

  // Delete a post
  const handleDelete = async id => {
    const prev = posts;
    setPosts(p => p.filter(x => x.id !== id));
    try { 
        await PostsService.remove(id); 
    } catch (e) { 
        setPosts(prev); // rollback
        setError('Failed to delete post: ' + e.message);
    }
  };

  // Add new post
  const handleAdd = async e => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const newPost = await PostsService.add({
        userId: activeUser.id,
        title: title.trim(),
        body: body.trim()
      });
      setPosts(p => [...p, newPost]);
      // reset form
      setTitle(''); setBody(''); 
      setShowForm(false);
    } catch (e) {
      setError('Add post failed: ' + e.message);
    }
  };

  const handleSearch = text => {
    setSearch(text);

    const ok =
      /^\d+$/.test(text) || // all-digits  (id search)
      text.length >= 2 || // or ≥2 letters
      text === ''; // empty → no error

    setSearchError(ok ? '' : 'Type at least 2 characters');
};

return (
    <>
      <div className={styles.toolbar}>
        <button className={styles.btn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New'}
        </button>
        <SearchBar
        value={search}
        onChange={handleSearch}
        error={searchError}
      />
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className={styles.addCard}>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Body (optional)"
            value={body}
            onChange={e => setBody(e.target.value)}
          />
          <button className={styles.btn}>Create</button>
        </form>
      )}

      <ul className={styles.list}>
        {posts.map(p => (
          <li key={p.id} className={p.id === selectedId ? styles.selected : ''}>
            <button
              className={styles.rowBtn}
              onClick={() => { setSelectedId(p.id); nav(`/posts/${p.id}`); }}
            >
              {p.id}. {p.title}
            </button>
            <div className={styles.icons}>
              <Link to={`/posts/${p.id}/edit`}>✏️</Link>
              <button onClick={() => handleDelete(p.id)}>🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
