// ---------------------------------------------------------
// PlayerBar — bottom player with shuffle, repeat, queue.
// ---------------------------------------------------------
import { useState } from 'react';
import { usePlayer } from '../context/AudioPlayerContext';
import { fmtTime, uploadUrl } from '../lib/format';
import { Icon } from './Icons';
import QueuePanel from './QueuePanel';

export default function PlayerBar() {
    const {
        current, queue, isPlaying, currentTime, duration, volume, muted, error,
        shuffle, repeat,
        togglePlay, seek, setVolumeLevel, toggleMute, next, prev,
        toggleShuffle, cycleRepeat,
    } = usePlayer();

    const [showQueue, setShowQueue] = useState(false);

    const song = current?.song;
    const isRadio = current?.source === 'radio';
    const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

    function onSeek(e) {
        if (isRadio || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct  = (e.clientX - rect.left) / rect.width;
        seek(pct * duration);
    }

    const upcoming = (() => {
        if (!current || isRadio || queue.length === 0) return [];
        const idx = queue.findIndex(s => s.id === current.song.id);
        if (idx === -1) return [];
        const out = [];
        for (let k = 1; k <= 3; k++) out.push(queue[(idx + k) % queue.length]);
        return out;
    })();

    return (
        <>
            <div className="shrink-0 bg-base-950/95 backdrop-blur-2xl
                      border-t border-white/[0.06]">
                {error && (
                    <div className="text-[11px] text-red-300 bg-red-500/10
                          border-b border-red-500/20 px-6 py-1.5">
                        Playback error: {error}
                    </div>
                )}

                <div className="h-20 flex items-center gap-4 px-4">
                    {/* Left: artwork + info */}
                    <div className="w-72 flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0
                            bg-base-800 flex items-center justify-center
                            text-cream-100/30 shadow-lg">
                            {song?.cover_url ? (
                                <img src={uploadUrl(song.cover_url)} alt=""
                                     className="w-full h-full object-cover" />
                            ) : isRadio
                                ? <Icon.Radio className="w-6 h-6" />
                                : <Icon.Music className="w-6 h-6" />}
                            {isPlaying && (
                                <div className="absolute inset-0 rounded-xl pointer-events-none
                                ring-1 ring-brand-500/40" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-cream-50">
                                {song?.title || 'Nothing playing'}
                            </div>
                            <div className="truncate text-xs text-cream-100/50 mt-0.5">
                                {song?.artist_name || '—'}
                            </div>
                        </div>
                    </div>

                    {/* Center: controls + progress */}
                    <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <div className="flex items-center gap-1">
                            <button
                                className={`btn-icon ${shuffle ? '!text-brand-400' : ''}`}
                                onClick={toggleShuffle}
                                disabled={isRadio}
                                title="Shuffle"
                            >
                                <Icon.Shuffle className="w-4 h-4" />
                            </button>

                            <button className="btn-icon" onClick={prev} disabled={isRadio}>
                                <Icon.Prev className="w-4 h-4" />
                            </button>

                            <button
                                onClick={togglePlay}
                                disabled={!song}
                                className="w-11 h-11 rounded-full bg-cream-50 text-base-950
                           flex items-center justify-center
                           hover:scale-105 transition-transform
                           shadow-lg shadow-black/40 disabled:opacity-50"
                            >
                                {isPlaying ? <Icon.Pause className="w-5 h-5" /> : <Icon.Play className="w-5 h-5" />}
                            </button>

                            <button className="btn-icon" onClick={next} disabled={isRadio}>
                                <Icon.Next className="w-4 h-4" />
                            </button>

                            <button
                                className={`btn-icon relative ${repeat !== 'off' ? '!text-brand-400' : ''}`}
                                onClick={cycleRepeat}
                                disabled={isRadio}
                                title={`Repeat: ${repeat}`}
                            >
                                <Icon.Repeat className="w-4 h-4" />
                                {repeat === 'one' && (
                                    <span className="absolute text-[9px] font-bold
                                   text-brand-400 bottom-1 right-1">1</span>
                                )}
                            </button>
                        </div>

                        <div className="w-full max-w-2xl flex items-center gap-3 text-[11px] text-cream-100/40">
                            <span className="w-10 text-right tabular-nums">{fmtTime(currentTime)}</span>
                            <div
                                className={`group flex-1 h-1.5 rounded-full bg-white/[0.07] relative
                            ${isRadio ? 'cursor-default' : 'cursor-pointer'}`}
                                onClick={onSeek}
                            >
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cool-500
                             transition-[width] duration-100"
                                    style={{ width: isRadio ? '100%' : `${progressPct}%` }}
                                />
                                {!isRadio && (
                                    <div
                                        className="absolute top-1/2 w-3 h-3 rounded-full bg-white
                               shadow-md opacity-0 group-hover:opacity-100
                               -translate-y-1/2 -translate-x-1/2 pointer-events-none
                               transition-opacity"
                                        style={{ left: `${progressPct}%` }}
                                    />
                                )}
                            </div>
                            <span className="w-10 tabular-nums">
                {isRadio ? 'LIVE' : fmtTime(duration)}
              </span>
                        </div>
                    </div>

                    {/* Right: upcoming + queue + volume */}
                    <div className="w-72 flex items-center justify-end gap-3 min-w-0">
                        {upcoming.length > 0 && (
                            <div className="hidden lg:flex items-center gap-1 mr-2">
                <span className="text-[10px] uppercase tracking-wider
                                 text-cream-100/35 mr-1">Next</span>
                                {upcoming.map((s, i) => (
                                    <div key={`${s.id}-${i}`}
                                         title={`${s.title} — ${s.artist_name}`}
                                         className="w-8 h-8 rounded-md overflow-hidden
                                  bg-base-800 border border-white/[0.06]">
                                        {s.cover_url ? (
                                            <img src={uploadUrl(s.cover_url)} alt=""
                                                 className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center
                                      text-[10px] text-cream-100/30">♪</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className={`btn-icon ${showQueue ? '!text-brand-400' : ''}`}
                            onClick={() => setShowQueue(s => !s)}
                            title="Queue"
                        >
                            <Icon.Queue className="w-4 h-4" />
                        </button>
                        <button className="btn-icon" onClick={toggleMute} title="Mute">
                            {muted || volume === 0
                                ? <Icon.Mute className="w-4 h-4" />
                                : <Icon.Volume className="w-4 h-4" />}
                        </button>
                        <input
                            type="range" min={0} max={1} step={0.01} value={volume}
                            onChange={(e) => setVolumeLevel(Number(e.target.value))}
                            className="w-24 accent-brand-500"
                        />
                    </div>
                </div>
            </div>

            {showQueue && <QueuePanel onClose={() => setShowQueue(false)} />}
        </>
    );
}