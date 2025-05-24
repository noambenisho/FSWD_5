import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { PostsService } from '../api/PostsService.js';
import { usePosts } from './PostsLayout.jsx';
import styles from './PostDetails.module.css';

export default function PostDetails() {
  const { postId } = useParams();
  const { activeUser } = useAuth();
  const { setError } = usePosts();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      PostsService.get(postId).then(setPost),
      PostsService.comments.list(postId).then(setComments)
    ]).catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [postId]);

  // Add comment
  const addComment = async e => {
    e.preventDefault();
    const body = e.target.body.value.trim();

    if (!body) return;

    e.target.reset();
    try {
      const newC = await PostsService.comments.add({
        postId,
        name: activeUser.username,
        email: activeUser.email,
        body
      });
      setComments(c => [...c, newC]);
    } catch (e) { 
        setError('Add comment failed: ' + e.message); 
    }
  };

  // Delete comment
  const delComment = async cid => {
    const prev = comments;
    setComments(c => c.filter(x => x.id !== cid));
    try { await PostsService.comments.remove(cid); }
    catch (e) {
      setComments(prev);
      setError('Delete comment failed: ' + e.message);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!post)   return <p>Post not found.</p>;

  return (
    <section>
      <h2>{post.title}</h2>
      <p className={styles.body}>{post.body}</p>

      <h3>Comments</h3>
      <ul className={styles.comments}>
        {comments.map(c => (
          <li key={c.id}>
            <div className={styles.commentHead}>
              <span>{c.email}</span>
              {c.email === activeUser.email &&
                <button onClick={() => delComment(c.id)}>🗑</button>}
            </div>
            <p>{c.body}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={addComment} className={styles.addComment}>
        <input name="body" placeholder="Add a comment…" />
        <button className={styles.btn}>Send</button>
      </form>
    </section>
  );
}
