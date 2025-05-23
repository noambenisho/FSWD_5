import { Outlet, useOutletContext } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { PostsService } from '../api/PostsService.js';
import Spinner from '../components/Spinner.jsx';
import styles from './PostsLayout.module.css';

export const PostsCtx = createContext(null);
export const usePosts = () => useOutletContext();

export default function PostsLayout() {
  const { activeUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch whenever user or search changes
  useEffect(() => {
    if (!activeUser) return;
    const fn = search
      ? PostsService.search(activeUser.id, search)
      : PostsService.list(activeUser.id);

    setLoading(true);
    fn.then(setPosts)
    .catch(e => setError(e.message))
    .finally(() => setLoading(false));
  }, [activeUser?.id, search]);

  const ctxValue = { posts, setPosts, selectedId, setSelectedId, search, setSearch, setError };

  return (
    <PostsCtx.Provider value={ctxValue}>
      <div className={styles.container}>
        <h1 className={styles.title}>Posts</h1>
        {error && <p className={styles.error}>{error}</p>}
        {loading ? <Spinner /> : <Outlet context={ctxValue} />}
      </div>
    </PostsCtx.Provider>
  );
}
