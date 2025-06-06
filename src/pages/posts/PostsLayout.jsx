import { Outlet, useOutletContext } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { PostsService } from '../../api/PostsService.js';
import Spinner from '../../components/Spinner.jsx';
import styles from './PostsLayout.module.css';
import BackButton from '../../components/BackButton.jsx';

export const PostsCtx = createContext(null);
export const usePosts = () => useOutletContext();

export default function PostsLayout() {
  const { activeUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchField, setSearchField] = useState("title");
  

  // Fetch whenever user or search changes
  useEffect(() => {
    if (!activeUser) return;

    let query = `?userId=${activeUser.id}`;

    if (searchField === "id") {
      query += `&id=${search.trim()}`;
    } else if (searchField === "title") {
      query += `&title_like=${encodeURIComponent(search.trim())}`;
    } else {
        return;
      }

    setLoading(true);
    const fn = search
      ? PostsService.search(query)
      : PostsService.list(activeUser.id);

    fn
      .then(setPosts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));

  }, [activeUser?.id, search]);

  const ctxValue = { posts, setPosts, selectedId, setSelectedId, search, setSearch, setError, loading, searchField, setSearchField };

  return (
    <PostsCtx.Provider value={ctxValue}>
      <main className={styles.container}>
        <BackButton />

        <section className={styles.hero}>
          <h1 className={styles.title}>Posts</h1>

          {error && <p className={styles.error}>{error}</p>}
          
          {loading ? <Spinner /> : <Outlet context={ctxValue} />}
        </section>

      </main>
    </PostsCtx.Provider>
  );
}
