import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { PostsService } from '../api/PostsService.js';
import { usePosts } from './PostsLayout.jsx';
import styles from './EditPostForm.module.css';
import Spinner from '../components/Spinner.jsx';

export default function EditPostForm() {
  const { postId } = useParams();
  const nav = useNavigate();
  const { activeUser } = useAuth();
  const { setError } = usePosts();
  const [loading, setLoad] = useState(true);
  const [post, setPost] = useState(null);

  useEffect(() => {
    setLoad(true);

    PostsService.get(postId)
      .then(setPost)
      .catch(e => setError(e.message))
      .finally(() => setLoad(false));

  }, [postId]);

  if (loading) return  <Spinner />;
  if (!post) return <p>Post not found.</p>;
  if (post.userId !== activeUser.id)
    return <p>Cannot edit someone else’s post.</p>;

  const save = async e => {
    e.preventDefault();

    const patch = {
      title: e.target.title.value.trim(),
      body: e.target.body.value.trim()
    };
    
    try {
      await PostsService.patch(postId, patch);
      nav('/posts');
    } catch (e) { 
      setError('Save failed: ' + e.message); 
    }
  };

  return (
    <form onSubmit={save} className={styles.editForm}>
      <h2>Edit Post</h2>
      <input name="title" defaultValue={post.title} required />
      <textarea name="body" defaultValue={post.body} required />
      <button className={styles.btn}>Save</button>
    </form>
  );
}
