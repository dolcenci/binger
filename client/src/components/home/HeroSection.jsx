// ---------------------------------------------------------
// HeroSection — cinematic home page hero.
// Background: a concert photograph + colour wash.
// Foreground: headline + CTA + floating artwork.
// ---------------------------------------------------------
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/AudioPlayerContext';
import { uploadUrl } from '../../lib/format';
import { Icon } from '../Icons';

export default function HeroSection({ spotlightSong }) {
    const { user } = useAuth();
    const { playSong } = usePlayer();

    const heroPhoto = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=2400&q=70';

    return (
        <section className="relative overflow-hidden rounded-3xl grain
                        border border-white/[0.06]">
            {/* Background */}
            <img
                src={heroPhoto}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-55"
                loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r
                      from-base-950 via-base-950/85 to-base-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t
                      from-base-950 via-transparent to-transparent" />

            {/* ambient blobs */}
            <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full
                      bg-brand-500/30 blur-3xl animate-glow" />
            <div className="absolute -bottom-40 right-1/3 w-80 h-80 rounded-full
                      bg-cool-500/25 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10
                      items-center px-8 md:px-14 py-16 md:py-20">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 chip !bg-brand-500/15
                          !border-brand-500/30 !text-brand-300 mb-5">
                        <Icon.Sparkles className="w-3 h-3" />
                        <span>New — R0.005 per play, straight to artists</span>
                    </div>

                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl
                         font-extrabold leading-[1.02] tracking-tight
                         text-cream-50 mb-6">
                        {user?.name
                            ? <>Welcome back,<br /><span className="text-brand-400">{user.name.split(' ')[0]}.</span></>
                            : <>Music, tuned<br /><span className="text-brand-400">to you.</span></>}
                    </h1>

                    <p className="text-cream-100/70 text-lg leading-relaxed mb-8 max-w-xl">
                        Stream independent music. Support the artists you love.
                        Discover the next sound before anyone else does.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        {spotlightSong && (
                            <button
                                onClick={() => playSong(spotlightSong, [spotlightSong])}
                                className="btn btn-primary !px-6 !py-3 text-base"
                            >
                                <Icon.Play className="w-5 h-5" />
                                <span>Play the top song</span>
                            </button>
                        )}
                        <Link to="/songs" className="btn btn-outline !px-6 !py-3 text-base">
                            Browse catalogue
                            <Icon.ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* meta row */}
                    <div className="mt-8 flex items-center gap-6 text-xs text-cream-100/50">
                        <Stat label="Artists" value="Independent" />
                        <span className="w-px h-6 bg-white/10" />
                        <Stat label="Payouts" value="Monthly" />
                        <span className="w-px h-6 bg-white/10" />
                        <Stat label="Radio" value="Live streams" />
                    </div>
                </div>

                {/* Floating album art */}
                {spotlightSong && (
                    <div className="hidden lg:block relative">
                        <div className="absolute -inset-6 rounded-[36px] bg-brand-500/20 blur-3xl" />
                        <div className="relative w-[340px] aspect-square rounded-[28px]
                            overflow-hidden shadow-2xl shadow-black/60
                            border border-white/10
                            rotate-[3deg]">
                            {spotlightSong.cover_url ? (
                                <img
                                    src={uploadUrl(spotlightSong.cover_url)}
                                    alt={spotlightSong.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-base-800" />
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-4
                              bg-gradient-to-t from-black/80 to-transparent">
                                <div className="text-[10px] uppercase tracking-[0.18em]
                                text-brand-400 font-bold">
                                    Spotlight
                                </div>
                                <div className="font-display font-bold text-cream-50 text-lg mt-1">
                                    {spotlightSong.title}
                                </div>
                                <div className="text-xs text-cream-100/60">
                                    {spotlightSong.artist_name}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function Stat({ label, value }) {
    return (
        <div>
            <div className="text-[10px] uppercase tracking-wider text-cream-100/40">
                {label}
            </div>
            <div className="text-cream-50 font-semibold mt-0.5">{value}</div>
        </div>
    );
}