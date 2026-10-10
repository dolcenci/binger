// ---------------------------------------------------------
// EditorPicks — magazine-style 4-card grid.
// Bigger than shelf cards, with a coloured top strip.
// ---------------------------------------------------------
import { usePlayer } from '../../context/AudioPlayerContext';
import { uploadUrl } from '../../lib/format';
import { Icon } from '../Icons';

const TAGS = [
    { label: 'Late-night', accent: 'from-brand-500 to-brand-400' },
    { label: 'Sunrise',    accent: 'from-cool-500 to-cool-400' },
    { label: 'Deep focus', accent: 'from-[#e8a598] to-[#ff6a2b]' },
    { label: 'Big mood',   accent: 'from-[#7c5cff] to-[#ff6a2b]' },
];

export default function EditorPicks({ songs = [] }) {
    const { playSong, current, isPlaying } = usePlayer();
    const picks = songs.slice(0, 4);
    if (picks.length === 0) return null;

    return (
        <section>
            <div className="flex items-end justify-between mb-5">
                <div>
                    <h2 className="section-title">Editor's picks</h2>
                    <p className="section-sub">A short list, refreshed often.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {picks.map((s, i) => {
                    const isCurrent = current?.song?.id === s.id;
                    const tag = TAGS[i % TAGS.length];
                    return (
                        <div key={s.id}
                             className="group relative rounded-3xl overflow-hidden
                            border border-white/[0.06] bg-base-900
                            flex flex-col h-[340px]">
                            <div className="absolute inset-0">
                                {s.cover_url ? (
                                    <img src={uploadUrl(s.cover_url)} alt=""
                                         className="w-full h-full object-cover
                                  transition-transform duration-500
                                  group-hover:scale-[1.05]" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br
                                  from-base-700 to-base-900" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t
                                from-base-950 via-base-950/40 to-transparent" />
                                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r
                                 ${tag.accent}`} />
                            </div>

                            <div className="relative mt-auto p-4">
                                <div className="chip !bg-black/50 !text-cream-50 !border-white/10 mb-2">
                                    {tag.label}
                                </div>
                                <div className="font-display text-lg font-bold text-cream-50
                                leading-snug line-clamp-2">
                                    {s.title}
                                </div>
                                <div className="text-xs text-cream-100/60 mt-0.5">
                                    {s.artist_name}
                                </div>

                                <button
                                    onClick={() => playSong(s, picks)}
                                    className="absolute bottom-4 right-4 w-11 h-11 rounded-full
                             bg-brand-500 text-white flex items-center justify-center
                             shadow-xl shadow-brand-500/40
                             opacity-0 group-hover:opacity-100
                             translate-y-2 group-hover:translate-y-0
                             transition-all"
                                >
                                    {isCurrent && isPlaying
                                        ? <Icon.Pause className="w-5 h-5" />
                                        : <Icon.Play className="w-5 h-5 translate-x-[1px]" />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}