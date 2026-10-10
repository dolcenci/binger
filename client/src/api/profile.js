// ---------------------------------------------------------
// Profile API.
// ---------------------------------------------------------
import { api } from './client';

export const profileApi = {
    me:     () => api.get('/api/profile/me').then(r => r.data),
    update: (payload) => api.put('/api/profile/me', payload).then(r => r.data),
    uploadPhoto: (formData) =>
        api.post('/api/profile/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(r => r.data),
};