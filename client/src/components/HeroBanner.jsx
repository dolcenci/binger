// ---------------------------------------------------------
// HeroBanner — photographic hero on the home page.
// Uses Unsplash for the background (no download needed).
// ---------------------------------------------------------
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from './Icons';

export default function HeroBanner() {
    const { user } = useAuth();

    // A concert-crowd image with warm light — fits our palette.
    const bg = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=2000&q=70';

    return (
        <section className="relative overflow-hidden rounded-3xl grain
                        border border-white/[0.06]
                        min-h-[280px] flex items-center">
            {/* background photo */}
            <img
                src={bg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                loading="eager"
            />
            {/* colour wash + vignette */}
            <div className="absolute inset-0 bg-gradient-to-r
                      from-base-950 via-base-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t
                      from-base-950/80 via-transparent to-transparent" />

            {/* sunset glow */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full
                      bg-brand-500/30 blur-3xl animate-glow" />
            <div className="absolute -right-10 bottom-0 w-64 h-64 rounded-full
                      bg-cool-500/20 blur-3xl" />

            {/* content */}
            <div className="relative z-10 px-8 md:px-12 py-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 chip !bg-brand-500/15
                        !border-brand-500/30 !text-brand-300 mb-4">
                    <Icon.Sparkles className="w-3 h-3" />
                    <span>New — R0.005 per play</span>
                </div>

                <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[1.05]
                       text-cream-50 mb-4">
                    {user?.name ? `Welcome back, ${user.name.split(' ')[0]}.` : 'Music, tuned to you.'}
                </h1>
                <p className="text-cream-100/70 text-base md:text-lg leading-relaxed mb-6
                      max-w-xl">
                    Stream independent music, support artists directly, and discover
                    the next sound before anyone else does.
                </p>

                <div className="flex items-center gap-3">
                    <Link to="/radio" className="btn btn-primary">
                        <Icon.Radio className="w-4 h-4" />
                        <span>Listen to radio</span>
                    </Link>
                    <Link to="/songs" className="btn btn-outline">
                        Browse all songs
                        <Icon.ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}