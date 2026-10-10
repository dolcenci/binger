// ---------------------------------------------------------
// SongCard — redesigned.
// Bigger artwork, hover play overlay, popularity bar.
// ---------------------------------------------------------
import { useEffect, useState } from 'react';
import { usePlayer } from '../context/AudioPlayerContext';
import { useAuth } from '../context/AuthContext';
import { heartsApi } from '../api/hearts';
import { uploadUrl } from '../lib/format';
import { Icon } from './Icons';

export default function SongCard({ song, queue = [], topPlays = 1 }) {
    const { playSong, current, isPlaying } = usePlayer();
    const { isAuthenticated } = useAuth();
    const [hearted, setHearted] = useState(false);
    const [hearts, setHearts]   = useState(song.hearts ?? 0);

    const isCurrent = current?.song?.id === song.id;
    const popularity = Math.min(100, Math.round(((song.plays || 0) / Math.max(topPlays, 1)) * 100));

    useEffect(() => setHearts(song.hearts ?? 0), [song.hearts]);

    useEffect(() => {
        let cancel = false;
        if (!isAuthenticated || !song.id) { setHearted(false); return; }
        heartsApi.isHearted(song.id)
            .then(r => { if (!cancel) setHearted(!!r.hearted); })
            .catch(() => {});
        return () => { cancel = true; };
    }, [song.id, isAuthenticated]);

    async function onHeart(e) {
        e.stopPropagation();
        if (!isAuthenticated) return;
        try {
            const r = await heartsApi.toggle(song.id);
            setHearted(r.hearted);
            setHearts(h => h + (r.hearted ? 1 : -1));
        } catch { /* ignore */ }
    }

    return (
        <div
            onClick={() => playSong(song, queue)}
            className={`group relative rounded-2xl p-3 cursor-pointer transition-all duration-200
                  ${isCurrent
                ? 'bg-gradient-to-b from-rose-400/[0.08] to-transparent ring-1 ring-rose-400/25'
                : 'hover:bg-white/[0.04]'}`}
        >
            <div className="relative aspect-square mb-3 rounded-xl overflow-hidden
                      bg-base-800">
                {song.cover_url ? (
                    <img
                        src={uploadUrl(song.cover_url)}
                        alt={song.title}
                        className="w-full h-full object-cover transition-transform duration-500
                       group-hover:scale-[1.04]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center
                          text-cream-100/25">
                        <Icon.Music className="w-10 h-10" />
                    </div>
                )}

                {/* hover play button */}
                <button
                    className={`absolute right-3 bottom-3 w-11 h-11 rounded-full
                      bg-brand-500 text-white flex items-center justify-center
                      shadow-xl shadow-brand-500/40
                      transition-all duration-200
                      ${isCurrent
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}
                    onClick={(e) => { e.stopPropagation(); playSong(song, queue); }}
                    title={isCurrent && isPlaying ? 'Playing' : 'Play'}
                >
                    {isCurrent && isPlaying
                        ? <Icon.Pause className="w-5 h-5" />
                        : <Icon.Play className="w-5 h-5 translate-x-[1px]" />}
                </button>

                {/* heart */}
                {isAuthenticated && (
                    <button
                        onClick={onHeart}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full
                       bg-black/40 backdrop-blur flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-black/60"
                        title={hearted ? 'Remove heart' : 'Heart'}
                    >
                        <Icon.Heart
                            filled={hearted}
                            className={`w-4 h-4 ${hearted ? 'text-rose-400' : 'text-white'}`}
                        />
                    </button>
                )}

                {/* now-playing pill */}
                {isCurrent && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full
                          bg-black/50 backdrop-blur text-[10px] uppercase
                          tracking-wider text-rose-400 font-semibold">
                        Now
                    </div>
                )}
            </div>

            <div className="min-w-0">
                <div className={`truncate text-sm font-semibold
                         ${isCurrent ? 'text-rose-400' : 'text-cream-50'}`}>
                    {song.title}
                </div>
                <div className="truncate text-xs text-cream-100/50 mt-0.5">
                    {song.artist_name}
                </div>

                {/* popularity bar */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cool-500"
                            style={{ width: `${popularity}%` }}
                        />
                    </div>
                    <span className="text-[10px] tabular-nums text-cream-100/40">
            {song.plays ?? 0}
          </span>
                </div>

                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-cream-100/40">
                    <Icon.Heart filled className="w-3 h-3" />
                    <span className="tabular-nums">{hearts}</span>
                </div>
            </div>
        </div>
    );
}