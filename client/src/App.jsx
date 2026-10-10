// ---------------------------------------------------------
// App root — providers + routes.
// ---------------------------------------------------------
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Artist from './pages/Artist';
import AllSongs from './pages/AllSongs';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import EditSong from './pages/EditSong';
import SearchResults from './pages/SearchResults';
import Radio from './pages/Radio';
import Podcasts from './pages/Podcasts';

export default function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <AudioPlayerProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login"    element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route
                                element={
                                    <ProtectedRoute>
                                        <AppShell />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="/"                element={<Home />} />
                                <Route path="/songs"           element={<AllSongs />} />
                                <Route path="/artist/:userId"  element={<Artist />} />
                                <Route path="/profile"         element={<Profile />} />
                                <Route path="/radio"           element={<Radio />} />
                                <Route path="/podcasts"        element={<Podcasts />} />
                                <Route path="/search"          element={<SearchResults />} />

                                <Route path="/dashboard"
                                       element={<ProtectedRoute role="artist"><Dashboard /></ProtectedRoute>} />
                                <Route path="/upload"
                                       element={<ProtectedRoute role="artist"><Upload /></ProtectedRoute>} />
                                <Route path="/song/:id/edit"
                                       element={<ProtectedRoute role="artist"><EditSong /></ProtectedRoute>} />
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </AudioPlayerProvider>
            </ToastProvider>
        </AuthProvider>
    );
}