import { request } from "./HttpClient";

export const AlbumsService = {   
    list:             (userId)                           => request(`/albums?userId=${userId}`),
    // listByUserSorted: (userId, sortBy)                   => request(`/albums?userId=${userId}&_sort=${sortBy}&_order=asc`),
    get:              id                                 => request(`/albums/${id}`),
    add:              albumObj                           => request('/albums', { method: 'POST', body: JSON.stringify(albumObj) }),
    patch:            (id, patch)                        => request(`/albums/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
    remove:           id                                 => request(`/albums/${id}`, { method: 'DELETE' }),
    search:           (query)                            => request(query),
    getPhotos:        (albumId, _start = 0, _limit = 8)  => request(`/photos?albumId=${albumId}&_start=${_start}&_limit=${_limit}`),
    addPhoto:         (photo)                            => request(`/photos`, {method: 'POST', body: JSON.stringify(photo)}),
    removePhoto:      (id)                               => request(`/photos/${id}`, {method: 'DELETE'}),
    updatePhoto:      (id, patch)                        => request(`/photos/${id}`, { method: 'PATCH', body: JSON.stringify(patch)})

};