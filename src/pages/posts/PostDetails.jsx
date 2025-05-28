import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { PostsService } from '../../api/PostsService.js';
import { usePosts } from './PostsLayout.jsx';
import styles from './PostDetails.module.css';
import Spinner from '../../components/Spinner.jsx';

export default function PostDetails() {
  const { postId } = useParams();
  const { activeUser } = useAuth();
  const { setError } = usePosts();
  
  const [editingId, setEditingId] = useState(null);
  const [editBody,  setEditBody]  = useState('');
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
  const handleAddComment = async e => {
    e.preventDefault();
    const body = e.target.body.value.trim();

    if (!body) return;

    e.target.reset();
    try {
      const newC = await PostsService.comments.add({
        postId,
        name: activeUser.username,
        email: activeUser.email,
        body,
      });
      setComments(c => [...c, newC]);
    } catch (e) { 
        setError('Add comment failed: ' + e.message); 
    }
  };

  // Delete comment
  const handleDelComment = async cid => {
    const prev = comments;
    setComments(c => c.filter(x => x.id !== cid));
    try { 
      await PostsService.comments.remove(cid); 
    } catch (e) {
      setComments(prev);
      setError('Delete comment failed: ' + e.message);
    }
  };

  // Edit comment
  const handleEditComment = async (e) => {
    e.preventDefault();
    const body = editBody.trim();
    if (!body) return;

    const prev = comments;
    setComments((all) =>
      all.map((c) => (c.id === editingId ? { ...c, body } : c))
    );

    try {
      await PostsService.comments.patch(editingId, { body });
      // close the edit form
      setEditingId(null);
    } catch (err) {
      // rollback on error
      setComments(prev);
      setError('Edit comment failed: ' + err.message);
    }
  };

  if (loading) return <Spinner />;
  if (!post) return <p>Post not found.</p>;

  return (
    <section className={styles.postContainer}>

      <div className={styles.postCard}>
        <h2>{post.title}</h2>
        <hr className={styles.hr}/>
        <p className={styles.body}>{post.body}</p>
      </div>

      <div className={styles.commentsSection}>

        <h3>Comments</h3>

        <ul className={styles.comments}>
          {comments.map((c) => (
            <li key={c.id} className={styles.comment}>

              <div className={styles.commentHead}>
                <span>{c.name || c.email}</span>
              </div>

              <p className={styles.commentBody}>{c.body}</p>

              {c.email === activeUser.email && (
                <div className={styles.commentActions}>
                  <button
                    className={styles.iconBtn}
                    aria-label="Edit"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditBody(c.body);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.iconBtn}
                    aria-label="Delete"
                    onClick={() => handleDelComment(c.id)}
                  >
                    🗑
                  </button>
                </div>
              )}

               {editingId === c.id && (
                <form
                  className={styles.editCommentForm}
                  onSubmit={handleEditComment}
                >
                  <input
                    className={styles.editInput}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    required
                  />
                  <button type="submit" className={styles.primaryBtn}>
                    Save
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </form>
              )}
              
            </li>
          ))}
        </ul>
    </div>

    <form onSubmit={handleAddComment} className={styles.addComment}>
      <input name="body" placeholder="Add a comment…" />
      <button className={styles.btn}>Send</button>
    </form>
    </section>
  );
}
