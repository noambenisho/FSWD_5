import { request } from "./HttpClient";

export const TodosService = {
  // list:             (userId)         => request(`/todos?userId=${userId}`),
  listByUserSorted: (userId, sortBy) => request(`/todos?userId=${userId}&_sort=${sortBy}&_order=asc`),
  get:              id               => request(`/todos/${id}`),
  add:              todoObj          => request('/todos', { method: 'POST', body: JSON.stringify(todoObj) }),
  patch:            (id, patch)      => request(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  remove:           id               => request(`/todos/${id}`, { method: 'DELETE' }),
  search:           (q)              => request(`/todos${q}`),
};