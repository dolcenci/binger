// ---------------------------------------------------------
// Song-related API calls.
// ---------------------------------------------------------
import { api } from './client';

export const songsApi = {
    list:         () => api.get('/api/songs').then(r => r.data),
    top:          (limit = 20) => api.get(`/api/songs/top?limit=${limit}`).then(r => r.data),
    artists:      () => api.get('/api/songs/artists').then(r => r.data),
    byArtist:     (userId) => api.get(`/api/songs/by-artist/${userId}`).then(r => r.data),
    get:          (id) => api.get(`/api/songs/${id}`).then(r => r.data),
    recordPlay:   (id, seconds) =>
        api.post(`/api/songs/${id}/play`, { seconds }).then(r => r.data),

    // --- artist only ---
    mine:         () => api.get('/api/songs/mine').then(r => r.data),
    mineEarnings: () => api.get('/api/songs/mine/earnings').then(r => r.data),
    upload:       (formData) =>
        api.post('/api/songs', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(r => r.data),
    update:       (id, formData) =>
        api.patch(`/api/songs/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(r => r.data),
    remove:       (id) => api.delete(`/api/songs/${id}`).then(r => r.data),
};