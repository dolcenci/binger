// ---------------------------------------------------------
// ArtistCTA — "Join the studio" section for listeners.
// Hidden for artists (they already have a studio).
// ---------------------------------------------------------
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../Icons';

export default function ArtistCTA() {
    const { user } = useAuth();
    if (user?.role === 'artist') return null;

    const photo = 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=1400&q=70';

    return (
        <section className="relative overflow-hidden rounded-3xl grain
                        border border-white/[0.06] min-h-[280px]">
            <img src={photo} alt=""
                 className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-r
                      from-base-950 via-base-950/80 to-transparent" />
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full
                      bg-cool-500/30 blur-3xl animate-glow" />

            <div className="relative z-10 p-8 md:p-12 max-w-xl">
                <div className="inline-flex items-center gap-2 chip !bg-cool-500/15
                        !border-cool-500/30 !text-cool-300 mb-4">
                    <Icon.Mic className="w-3 h-3" />
                    <span>For artists</span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-extrabold
                       text-cream-50 leading-tight mb-4">
                    Your music,<br />your payouts.
                </h2>
                <p className="text-cream-100/70 mb-6 max-w-md">
                    Upload your catalogue, set the artwork, write the lyrics.
                    Earn R0.005 per qualified play. Claim monthly.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                    <Link to="/register" className="btn btn-primary !px-6 !py-3 text-base">
                        Become an artist
                    </Link>
                    <Link to="/songs" className="btn btn-outline !px-6 !py-3 text-base">
                        See what's live
                    </Link>
                </div>
            </div>
        </section>
    );
}