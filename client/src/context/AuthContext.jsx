// ---------------------------------------------------------
// AuthContext — holds the current user + JWT.
// Provides login(), register(), logout().
// Persists to localStorage so refresh keeps the session.
// ---------------------------------------------------------
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

const TOKEN_KEY = 'binger_token';
const USER_KEY  = 'binger_user';

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [token, setToken]     = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = localStorage.getItem(TOKEN_KEY);
        const u = localStorage.getItem(USER_KEY);
        if (t && u) {
            setToken(t);
            try { setUser(JSON.parse(u)); } catch { /* ignore bad JSON */ }
        }
        setLoading(false);
    }, []);

    function persist(newToken, newUser) {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }

    async function login(email, password) {
        const { data } = await api.post('/api/auth/login', { email, password });
        persist(data.token, data.user);
        return data.user;
    }

    async function register(payload) {
        const { data } = await api.post('/api/auth/register', payload);
        persist(data.token, data.user);
        return data.user;
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    }

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isArtist: user?.role === 'artist',
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}