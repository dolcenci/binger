// ---------------------------------------------------------
// Artist — artist profile with a colour-tinted hero header.
// ---------------------------------------------------------
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { songsApi } from '../api/songs';
import SongCard from '../components/SongCard';
import { Spinner, EmptyState } from '../components/States';
import { Icon } from '../components/Icons';

function gradientFor(name = '') {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    return `linear-gradient(135deg, hsl(${h}, 65%, 45%), hsl(${(h + 40) % 360}, 65%, 35%))`;
}

export default function Artist() {
    const { userId } = useParams();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancel = false;
        setLoading(true);
        songsApi.byArtist(userId)
            .then(d => { if (!cancel) setSongs(d.songs || []); })
            .catch(err => { if (!cancel) setError(err.message); })
            .finally(() => { if (!cancel) setLoading(false); });
        return () => { cancel = true; };
    }, [userId]);

    const name = songs[0]?.artist_name || 'Artist';
    const totalPlays = useMemo(
        () => songs.reduce((sum, s) => sum + (s.plays || 0), 0),
        [songs]
    );
    const maxPlays = useMemo(
        () => Math.max(1, ...songs.map(s => s.plays || 0)),
        [songs]
    );

    if (loading) return <Spinner label="Loading artist…" />;
    if (error)   return <EmptyState title="Couldn't load artist" hint={error} />;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative rounded-3xl overflow-hidden grain
                      border border-white/[0.06]">
                <div className="absolute inset-0 opacity-40"
                     style={{ background: gradientFor(name) }} />
                <div className="absolute inset-0 bg-gradient-to-t
                        from-base-950 via-base-950/60 to-transparent" />

                <div className="relative z-10 p-8 md:p-10 flex items-end gap-6">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl shrink-0
                          flex items-center justify-center
                          font-display font-black text-white text-4xl
                          shadow-2xl shadow-black/50 border border-white/10"
                         style={{ background: gradientFor(name) }}>
                        {name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.16em]
                            text-cream-100/60 font-semibold mb-2">
                            Artist
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold
                           text-cream-50 leading-tight truncate">
                            {name}
                        </h1>
                        <div className="flex items-center gap-4 mt-3 text-sm text-cream-100/60">
                            <span>{songs.length} song{songs.length === 1 ? '' : 's'}</span>
                            <span className="w-1 h-1 rounded-full bg-cream-100/30" />
                            <span>{totalPlays} total play{totalPlays === 1 ? '' : 's'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back link */}
            <Link to="/" className="inline-flex items-center gap-1 text-sm
                               text-cream-100/50 hover:text-white transition-colors">
                <Icon.ChevronLeft className="w-4 h-4" />
                Back home
            </Link>

            {/* Songs */}
            {songs.length === 0 ? (
                <EmptyState title="No songs yet" hint="This artist hasn't uploaded yet." />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {songs.map(s => (
                        <SongCard key={s.id} song={s} queue={songs} topPlays={maxPlays} />
                    ))}
                </div>
            )}
        </div>
    );
}