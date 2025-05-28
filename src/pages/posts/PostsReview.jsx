import { Link, useNavigate } from 'react-router-dom';
import { useState }   from 'react';
import { usePosts } from './PostsLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { PostsService } from '../../api/PostsService.js';
import SearchBar from '../../components/SearchBar.jsx';
import Spinner from '../../components/Spinner.jsx';
import styles from './PostsReview.module.css';

export default function PostsReview() {
  const nav = useNavigate();
  const { activeUser } = useAuth();
  const {
    posts, setPosts,
    selectedId, setSelectedId,
    search, setSearch, setError, loading, searchField, setSearchField
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

          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className={styles.control}
          >
            <option value="id">ID</option>    
            <option value="title">Title</option>
          </select>

          <SearchBar className={styles.searchInput}
          value={search}
          onChange={setSearch}
          placeholder={`Search by ${searchField}…`}
          />

          {loading && <Spinner className={styles.small}/>}
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className={styles.addCard}>
            <input
              name="title"
              placeholder="Title"
              className={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <textarea
              name="body"
              placeholder="Body"
              className={styles.input}
              value={body}
              rows={3}
              onChange={e => setBody(e.target.value)}
            />

            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setShowForm(false);
                  setTitle(''); setBody('');
                }}
              >
                Cancel
              </button>

              <button 
                type="submit" 
                className={styles.primaryBtn}>
                  Create
                </button>
            </div>

          </form>
        )}

        <ul className={styles.list}>
          {posts.map((p) => (
            <li
              key={p.id}
              className={[
                styles.card,
                p.id === selectedId ? styles.selected : '',
              ].join(' ')}
              onClick={() => {
                setSelectedId(p.id);
                nav(`/posts/${p.id}`);
              }}
            >

              <span className={styles.rowBtn}>
                {p.id}. {p.title}
              </span>

              <div className={styles.icons}>
                <Link
                  to={`/posts/${p.id}/edit`}
                  className={styles.iconBtn}
                  aria-label="Edit"
                  onClick={(e) => e.stopPropagation()}
                >
                  ✏️
                </Link>
                <button
                  className={styles.iconBtn}
                  aria-label="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p.id);
                  }}
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      </>
  );
};