// ---------------------------------------------------------
// Hearts API.
// ---------------------------------------------------------
import { api } from './client';

export const heartsApi = {
    toggle:    (songId) => api.post(`/api/hearts/${songId}`).then(r => r.data),
    mine:      () => api.get('/api/hearts/mine').then(r => r.data),
    isHearted: (songId) => api.get(`/api/hearts/song/${songId}`).then(r => r.data),
};