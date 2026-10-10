// ---------------------------------------------------------
// TopBar — redesigned.
// Glassy header, big search, avatar chip, logout.
// ---------------------------------------------------------
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from './Icons';

export default function TopBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function onSubmit(e) {
        e.preventDefault();
        const q = e.currentTarget.q.value.trim();
        if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
    }

    return (
        <header className="h-16 shrink-0 flex items-center gap-4 px-6
                        bg-base-950/50 backdrop-blur-xl
                        border-b border-white/[0.06]">
            {/* Search */}
            <form onSubmit={onSubmit} className="flex-1 max-w-xl relative">
                <Icon.Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2
                                text-cream-100/40 pointer-events-none" />
                <input
                    name="q"
                    className="input pl-10 !py-2 !bg-base-900/60 !border-white/[0.06]
                     focus:!bg-base-900/80"
                    placeholder="Search songs, artists…"
                />
            </form>

            <div className="ml-auto flex items-center gap-2">
                {user ? (
                    <>
                        <Link to="/profile"
                              className="hidden md:flex items-center gap-3 pl-1 pr-3 py-1
                             rounded-full hover:bg-white/[0.06] transition-colors">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br
                               from-brand-500 to-cool-500
                               flex items-center justify-center
                               text-xs font-bold text-white">
                {user.name?.[0]?.toUpperCase() || '?'}
              </span>
                            <span className="text-sm text-cream-100/80">{user.name}</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="btn-icon"
                            title="Log out"
                        >
                            <Icon.Logout className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary text-sm">Sign in</Link>
                )}
            </div>
        </header>
    );
}