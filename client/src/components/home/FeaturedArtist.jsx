// ---------------------------------------------------------
// FeaturedArtist — big editorial split for the top artist.
// Photo on the right, headline + stats + play button left.
// ---------------------------------------------------------
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/AudioPlayerContext';
import { uploadUrl } from '../../lib/format';
import { Icon } from '../Icons';

export default function FeaturedArtist({ artist, topSong }) {
    if (!artist) return null;

    const { playSong } = usePlayer();

    // A photo that matches "artist at work" energy
    const photo = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70';

    return (
        <section className="relative overflow-hidden rounded-3xl grain
                        border border-white/[0.06]
                        bg-gradient-to-br from-base-850 via-base-900 to-base-950">
            <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_10%_10%,rgba(255,106,43,0.18),transparent_60%)]" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 items-stretch">
                {/* Left: text */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 chip !bg-cool-500/15
                          !border-cool-500/30 !text-cool-300 mb-4 w-fit">
                        <Icon.Sparkles className="w-3 h-3" />
                        <span>Featured artist</span>
                    </div>

                    <h2 className="font-display text-4xl md:text-5xl font-extrabold
                         text-cream-50 leading-tight mb-4">
                        {artist.artist_name}
                    </h2>
                    <p className="text-cream-100/60 mb-6 max-w-md">
                        {artist.song_count} song{artist.song_count === 1 ? '' : 's'} on
                        Binger, and {artist.total_plays} play{artist.total_plays === 1 ? '' : 's'} to date.
                        Their sound is what we wish more people were making.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        {topSong && (
                            <button
                                onClick={() => playSong(topSong, [topSong])}
                                className="btn btn-primary !px-5 !py-2.5"
                            >
                                <Icon.Play className="w-4 h-4" />
                                Play their top song
                            </button>
                        )}
                        <Link
                            to={`/artist/${artist.user_id}`}
                            className="btn btn-outline !px-5 !py-2.5"
                        >
                            Visit profile
                            <Icon.ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Right: photo with quote overlay */}
                <div className="relative min-h-[320px] lg:min-h-[420px]">
                    <img
                        src={photo}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover
                       lg:rounded-l-none rounded-3xl lg:rounded-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t
                          from-base-950 via-base-950/40 to-transparent" />

                    {topSong && (
                        <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3
                            rounded-2xl bg-black/40 backdrop-blur-md
                            border border-white/10 p-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0
                              bg-base-800">
                                {topSong.cover_url && (
                                    <img src={uploadUrl(topSong.cover_url)} alt=""
                                         className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-[10px] uppercase tracking-wider
                                text-brand-400 font-bold">
                                    Top track
                                </div>
                                <div className="truncate text-sm font-semibold text-cream-50">
                                    {topSong.title}
                                </div>
                            </div>
                            <button
                                onClick={() => playSong(topSong, [topSong])}
                                className="w-10 h-10 rounded-full bg-brand-500 text-white
                           flex items-center justify-center shrink-0
                           shadow-lg shadow-brand-500/40 hover:scale-105 transition"
                            >
                                <Icon.Play className="w-4 h-4 translate-x-[1px]" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}