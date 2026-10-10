// ---------------------------------------------------------
// Podcasts — 5 playable episodes.
// Using SoundHelix sample MP3s for reliability. Swap the
// URL fields for real podcast episodes later.
// ---------------------------------------------------------
import { usePlayer } from '../context/AudioPlayerContext';
import { Icon } from '../components/Icons';

const PODCASTS = [
    {
        id: 'podcast-1',
        title: 'The Long Way Home',
        show: 'Road Notes',
        episode: 'Episode 1',
        duration: '6 min',
        genre: 'Stories',
        color: 'from-[#ff6a2b] to-[#ff8352]',
        cover: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=70',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        description: 'The first leg of a coast-to-coast trip.',
    },
    {
        id: 'podcast-2',
        title: 'After the Show',
        show: 'Backstage',
        episode: 'Episode 2',
        duration: '5 min',
        genre: 'Music',
        color: 'from-[#7c5cff] to-[#9b83ff]',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=70',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        description: 'Conversations with the band after the last song.',
    },
    {
        id: 'podcast-3',
        title: 'Deep Work',
        show: 'Focus Sessions',
        episode: 'Episode 3',
        duration: '7 min',
        genre: 'Ambient',
        color: 'from-[#e8a598] to-[#ff6a2b]',
        cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=70',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        description: 'A quiet hour for the work that matters.',
    },
    {
        id: 'podcast-4',
        title: 'The Archive',
        show: 'Found Sound',
        episode: 'Episode 4',
        duration: '6 min',
        genre: 'History',
        color: 'from-[#7c5cff] to-[#e8a598]',
        cover: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=1200&q=70',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        description: 'Lost tapes, restored and revisited.',
    },
    {
        id: 'podcast-5',
        title: 'Sunday Slow',
        show: 'Weekend Mix',
        episode: 'Episode 5',
        duration: '8 min',
        genre: 'Chill',
        color: 'from-[#ff8352] to-[#7c5cff]',
        cover: 'https://images.unsplash.com/photo-1461784121038-f088ca1e7714?auto=format&fit=crop&w=1200&q=70',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        description: 'Nothing to do. Nowhere to be.',
    },
];

export default function Podcasts() {
    const { playSong, current, isPlaying, togglePlay } = usePlayer();

    const queueForPlayer = PODCASTS.map(p => ({
        id: p.id,
        title: p.title,
        artist_name: p.show,
        audio_url: p.url,
        cover_url: p.cover,
        plays: 0,
        hearts: 0,
    }));

    function podcastToSong(p) {
        return queueForPlayer.find(q => q.id === p.id);
    }

    function isCurrentPodcast(p) {
        return current?.song?.id === p.id;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="section-title">Podcasts</h1>
                <p className="section-sub">
                    {PODCASTS.length} episodes. Play them like songs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {PODCASTS.map(p => {
                    const active = isCurrentPodcast(p);
                    return (
                        <div
                            key={p.id}
                            className={`card card-hover overflow-hidden flex flex-col
                          ${active ? 'ring-1 ring-brand-500/40' : ''}`}
                        >
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden
                              -m-4 mb-4">
                                <img
                                    src={p.cover}
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t
                                 ${p.color} opacity-25 mix-blend-multiply`} />
                                <div className="absolute inset-0 bg-gradient-to-t
                                from-base-950/80 via-transparent to-transparent" />

                                <div className="absolute bottom-3 left-3 chip !bg-black/40
                                !text-cream-50 !border-white/10">
                                    {p.genre}
                                </div>

                                <button
                                    className="absolute bottom-3 right-3 w-12 h-12 rounded-full
                             bg-brand-500 text-white flex items-center justify-center
                             shadow-xl shadow-brand-500/40
                             hover:scale-105 transition-transform"
                                    onClick={() => active ? togglePlay() : playSong(podcastToSong(p), queueForPlayer)}
                                >
                                    {active && isPlaying
                                        ? <Icon.Pause className="w-5 h-5" />
                                        : <Icon.Play className="w-5 h-5 translate-x-[1px]" />}
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="text-[11px] uppercase tracking-wider
                                text-cream-100/50 font-semibold mb-1">
                                    {p.show} · {p.episode}
                                </div>
                                <h3 className="font-display text-lg font-bold text-cream-50
                               leading-snug mb-2">
                                    {p.title}
                                </h3>
                                <p className="text-sm text-cream-100/60 leading-relaxed flex-1">
                                    {p.description}
                                </p>
                                <div className="flex items-center gap-2 mt-3 text-[11px]
                                text-cream-100/40">
                                    <Icon.Mic className="w-3.5 h-3.5" />
                                    <span>{p.duration}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}