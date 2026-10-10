// ---------------------------------------------------------
// Home — the impressive landing page.
//
// Structure (top to bottom):
//   Hero → Marquee → Featured artist → Editor's picks
//   → Trending row → New releases row → Mood tiles
//   → Artist CTA → Footer
// ---------------------------------------------------------
import { useEffect, useMemo, useState } from 'react';
import { songsApi } from '../api/songs';
import HeroSection from '../components/home/HeroSection';
import Marquee from '../components/home/Marquee';
import FeaturedArtist from '../components/home/FeaturedArtist';
import EditorPicks from '../components/home/EditorPicks';
import ShelfRow from '../components/home/ShelfRow';
import GenreTiles from '../components/home/GenreTiles';
import ArtistCTA from '../components/home/ArtistCTA';
import Footer from '../components/home/Footer';
import { Spinner } from '../components/States';

export default function Home() {
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancel = false;
        Promise.all([songsApi.list(), songsApi.artists()])
            .then(([s, a]) => {
                if (cancel) return;
                setSongs(s.songs || []);
                setArtists(a.artists || []);
            })
            .finally(() => { if (!cancel) setLoading(false); });
        return () => { cancel = true; };
    }, []);

    const trending = useMemo(
        () => [...songs].sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 12),
        [songs]
    );
    const newest = useMemo(
        () => [...songs].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 12),
        [songs]
    );
    const spotlightSong = trending[0] || null;

    // Featured artist = the one with the most total plays.
    const featuredArtist = useMemo(() => {
        if (artists.length === 0) return null;
        return [...artists].sort((a, b) =>
            (b.total_plays || 0) - (a.total_plays || 0)
        )[0];
    }, [artists]);

    const featuredArtistTopSong = useMemo(() => {
        if (!featuredArtist) return null;
        return trending.find(s => s.user_id === featuredArtist.user_id) || null;
    }, [featuredArtist, trending]);

    if (loading) return <Spinner label="Loading Binger…" />;

    return (
        <div className="space-y-12 -mt-2">
            {/* Hero */}
            <HeroSection spotlightSong={spotlightSong} />

            {/* Marquee strip */}
            <Marquee items={trending.slice(0, 8)} />

            {/* Featured artist */}
            {featuredArtist && (
                <FeaturedArtist artist={featuredArtist} topSong={featuredArtistTopSong} />
            )}

            {/* Editor's picks */}
            <EditorPicks songs={newest} />

            {/* Trending */}
            <ShelfRow
                title="Trending now"
                sub="Most played on Binger today"
                songs={trending}
            />

            {/* New releases */}
            <ShelfRow
                title="New on Binger"
                sub="Fresh uploads from independent artists"
                songs={newest}
            />

            {/* Mood tiles */}
            <GenreTiles />

            {/* Artist CTA (hidden for artists) */}
            <ArtistCTA />

            {/* Footer */}
            <Footer />
        </div>
    );
}