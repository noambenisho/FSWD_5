import { request } from './HttpClient.js';

export const UsersService = {
  list:             ()           => request('/users'),
  get:              id           => request(`/users/${id}`),
  add:              userObj      => request('/users', { method:'POST', body: JSON.stringify(userObj) }),
  patch:            (id, patch)  => request(`/users/${id}`, { method:'PATCH', body: JSON.stringify(patch) }),
  findByUsername:   uname        => request(`/users?username=${encodeURIComponent(uname)}`).then(arr => arr[0] || null) 
};
