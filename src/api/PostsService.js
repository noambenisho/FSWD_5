import { request } from './HttpClient.js';

export const PostsService = {
  list:    userId       => request(`/posts?userId=${userId}`),
  search:  (userId, q)  => request(`/posts?userId=${userId}&title_like=${encodeURIComponent(q)}`),
  get:     id           => request(`/posts/${id}`),
  add:     post         => request('/posts',        { method:'POST',   body: JSON.stringify(post) }),
  patch:   (id, patch)  => request(`/posts/${id}`,  { method:'PATCH',  body: JSON.stringify(patch) }),
  remove:  id           => request(`/posts/${id}`,  { method:'DELETE' }),

  comments: {
    list:   postId      => request(`/comments?postId=${postId}`),
    add:    comment     => request('/comments',     { method:'POST',   body: JSON.stringify(comment) }),
    patch:  (id, patch) => request(`/comments/${id}`,{method:'PATCH',  body: JSON.stringify(patch) }),
    remove: id          => request(`/comments/${id}`,{method:'DELETE' })
  }
};
