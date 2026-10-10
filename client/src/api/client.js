// ---------------------------------------------------------
// Axios instance pointed at the Binger backend.
// Attaches the JWT (if present) to every request.
// On any 401, clears the session and bounces to /login.
// ---------------------------------------------------------
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token before every request.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('binger_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally.
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('binger_token');
            localStorage.removeItem('binger_user');
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(err);
    }
);