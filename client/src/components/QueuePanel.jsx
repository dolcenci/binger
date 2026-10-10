// ---------------------------------------------------------
// QueuePanel — slide-out drawer showing the current queue.
// Click a row to jump; × removes it.
// ---------------------------------------------------------
import { usePlayer } from '../context/AudioPlayerContext';
import { uploadUrl } from '../lib/format';
import { Icon } from './Icons';

export default function QueuePanel({ onClose }) {
    const { queue, current, playFromQueue, removeFromQueue } = usePlayer();

    return (
        <div className="fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <aside className="absolute right-0 top-0 h-full w-[380px] max-w-[90vw]
                        bg-base-900/95 backdrop-blur-xl
                        border-l border-white/[0.08]
                        shadow-2xl shadow-black/60
                        flex flex-col">
                <div className="flex items-center justify-between px-5 py-4
                        border-b border-white/[0.06]">
                    <div>
                        <div className="font-display font-bold text-cream-50">Queue</div>
                        <div className="text-xs text-cream-100/40">
                            {queue.length} track{queue.length === 1 ? '' : 's'}
                        </div>
                    </div>
                    <button className="btn-icon" onClick={onClose} title="Close">
                        <Icon.ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {queue.length === 0 && (
                        <div className="text-sm text-cream-100/40 p-4 text-center">
                            Nothing queued.
                        </div>
                    )}
                    {queue.map((s, i) => {
                        const isCurrent = current?.song?.id === s.id;
                        return (
                            <div
                                key={`${s.id}-${i}`}
                                className={`group flex items-center gap-3 p-2 rounded-xl
                            transition
                            ${isCurrent
                                    ? 'bg-brand-500/10 ring-1 ring-brand-500/25'
                                    : 'hover:bg-white/[0.04]'}`}
                            >
                                <button
                                    onClick={() => playFromQueue(i)}
                                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden
                                  bg-base-800 shrink-0">
                                        {s.cover_url ? (
                                            <img src={uploadUrl(s.cover_url)} alt=""
                                                 className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center
                                      text-cream-100/30">
                                                <Icon.Music className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className={`truncate text-sm
                                     ${isCurrent ? 'text-brand-400 font-semibold' : 'text-cream-50'}`}>
                                            {s.title}
                                        </div>
                                        <div className="truncate text-xs text-cream-100/50">
                                            {s.artist_name}
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => removeFromQueue(i)}
                                    className="btn-icon opacity-0 group-hover:opacity-100"
                                    title="Remove"
                                >
                                    <Icon.Logout className="w-4 h-4 rotate-180" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </aside>
        </div>
    );
}