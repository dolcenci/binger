// ---------------------------------------------------------
// AppShell — sidebar + top bar + main + bottom player.
// Mounts global keyboard shortcuts.
// ---------------------------------------------------------
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PlayerBar from './PlayerBar';
import LyricsPanel from './LyricsPanel';
import ToastHost from './ToastHost';
import { useAuth } from '../context/AuthContext';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

export default function AppShell() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useKeyboardShortcuts();

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <TopBar />
                    <main
                        className="flex-1 overflow-y-auto px-8 pt-6 pb-10 space-y-8"
                        key={location.pathname}
                    >
                        <Outlet />
                        <LyricsPanel />
                    </main>
                </div>
            </div>
            <PlayerBar />
            {isAuthenticated && <ToastHost />}
        </div>
    );
}