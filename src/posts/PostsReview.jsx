import { Link, useNavigate } from 'react-router-dom';
import { useState }   from 'react';
import { usePosts } from './PostsLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { PostsService } from '../api/PostsService.js';
import SearchBar from '../components/SearchBar.jsx';
import Spinner from '../components/Spinner.jsx';
import styles from './PostsReview.module.css';

export default function PostsReview() {
  const nav = useNavigate();
  const { activeUser } = useAuth();
  const {
    posts, setPosts,
    selectedId, setSelectedId,
    search, setSearch, setError, loading
  } = usePosts();

   // States for the inline “new post” form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  
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
  
  const resetForm = () => { setTitle(''); setBody(''); setShowForm(false); };

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
      resetForm();

    } catch (e) {
      setError('Add post failed: ' + e.message);
    }
  };

  return (
      <>
        <div className={styles.toolbar}>

          <button className={styles.btn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New'}
          </button>

          <SearchBar className={styles.searchInput}
          value={search}
          onChange={setSearch}
        />
        {loading && <Spinner className={styles.small}/>}
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
              placeholder="Body"
              value={body}
              onChange={e => setBody(e.target.value)}
            />
            <button className={styles.btn}>Create</button>
          </form>
        )}

        <ul className={styles.list}>
          {posts.map(p => (
            <li key={p.id} className={p.id === selectedId ? styles.selected : undefined}>
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
};