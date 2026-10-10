// ---------------------------------------------------------
// Sidebar — redesigned.
// Nav with icons, active accent, tighter top-songs list.
// ---------------------------------------------------------
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { songsApi } from '../api/songs';
import { usePlayer } from '../context/AudioPlayerContext';
import { useAuth } from '../context/AuthContext';
import { Icon } from './Icons';

export default function Sidebar() {
    const [top, setTop] = useState([]);
    const { playSong, current } = usePlayer();
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        songsApi.top(8).then(d => setTop(d.songs || [])).catch(() => {});
    }, [location.pathname]);

    const link = ({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2 rounded-xl text-sm
     transition-all duration-150
     ${isActive
            ? 'bg-gradient-to-r from-brand-500/20 to-transparent text-white border border-brand-500/20'
            : 'text-cream-100/70 hover:text-white hover:bg-white/[0.05]'}`;

    const iconProps = 'w-[18px] h-[18px] shrink-0';

    return (
        <aside className="w-64 shrink-0 flex flex-col h-full
                       bg-base-950/80 backdrop-blur-xl
                       border-r border-white/[0.06]">
            {/* Brand */}
            <div className="px-5 pt-6 pb-4">
                <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br
                           from-brand-500 to-cool-500
                           flex items-center justify-center
                           shadow-lg shadow-brand-500/30
                           group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm font-display">B</span>
          </span>
                    <span className="text-xl font-display font-extrabold tracking-tight text-cream-50">
            Binger
          </span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="px-3 space-y-0.5">
                <NavLink to="/"         className={link} end>
                    <Icon.Home className={iconProps} /> <span>Home</span>
                </NavLink>
                <NavLink to="/songs"    className={link}>
                    <Icon.Music className={iconProps} /> <span>All songs</span>
                </NavLink>
                <NavLink to="/podcasts" className={link}>
                    <Icon.Mic className={iconProps} /> <span>Podcasts</span>
                </NavLink>
                <NavLink to="/radio"    className={link}>
                    <Icon.Radio className={iconProps} /> <span>Radio</span>
                </NavLink>
                <NavLink to="/profile"  className={link}>
                    <Icon.User className={iconProps} /> <span>Profile</span>
                </NavLink>

                {user?.role === 'artist' && (
                    <>
                        <div className="pt-4 pb-2 px-3 text-[10px] uppercase tracking-[0.14em]
                            text-cream-100/40 font-semibold">
                            Artist
                        </div>
                        <NavLink to="/dashboard" className={link}>
                            <Icon.Dashboard className={iconProps} /> <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/upload" className={link}>
                            <Icon.Upload className={iconProps} /> <span>Upload song</span>
                        </NavLink>
                    </>
                )}
            </nav>

            {/* Top songs */}
            <div className="mt-6 px-5 flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.14em]
                        text-cream-100/40 font-semibold">
                    Top songs
                </div>
                <Icon.Fire className="w-3.5 h-3.5 text-brand-400" />
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                {top.length === 0 && (
                    <div className="text-xs text-cream-100/40 px-3 py-2">No songs yet.</div>
                )}
                {top.map((song, i) => {
                    const active = current?.song?.id === song.id;
                    return (
                        <button
                            key={song.id}
                            onClick={() => playSong(song, top)}
                            className={`w-full text-left flex items-center gap-3 px-3 py-2
                          rounded-xl transition-all duration-150 group
                          ${active
                                ? 'bg-rose-400/10 text-rose-400'
                                : 'text-cream-100/70 hover:bg-white/[0.05] hover:text-white'}`}
                        >
              <span className="w-4 text-[11px] tabular-nums text-cream-100/30
                                group-hover:text-cream-100/60">
                {i + 1}
              </span>
                            <span className="flex-1 truncate text-sm">{song.title}</span>
                            <span className="text-[10px] tabular-nums text-cream-100/40">
                {song.plays}
              </span>
                        </button>
                    );
                })}
            </div>

            {/* Vinyl */}
            <div className="p-6 flex justify-center border-t border-white/[0.06]">
                <div className={`w-20 h-20 rounded-full disc spinning-vinyl
                         flex items-center justify-center
                         ${current ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="w-5 h-5 rounded-full bg-brand-500
                          shadow-lg shadow-brand-500/60" />
                </div>
            </div>
        </aside>
    );
}