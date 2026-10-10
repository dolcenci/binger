// ---------------------------------------------------------
// Wrap any route element to require authentication
// (and optionally a role: 'artist' or 'listener').
// ---------------------------------------------------------
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-zinc-400">
                Loading…
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user?.role !== role) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-3 text-center px-4">
                <h1 className="text-2xl font-semibold">Not allowed</h1>
                <p className="text-zinc-400">This area is for {role}s only.</p>
            </div>
        );
    }

    return children;
}