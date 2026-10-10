// ---------------------------------------------------------
// Search Results — filters /api/songs and /api/songs/artists
// client-side against the query string.
// ---------------------------------------------------------
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { songsApi } from '../api/songs';
import SongCard from '../components/SongCard';
import ArtistChip from '../components/ArtistChip';
import { Spinner, EmptyState } from '../components/States';

export default function SearchResults() {
    const [params] = useSearchParams();
    const query = (params.get('q') || '').toLowerCase();

    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([songsApi.list(), songsApi.artists()])
            .then(([s, a]) => {
                setSongs(s.songs || []);
                setArtists(a.artists || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const matchedSongs = useMemo(() => {
        if (!query) return [];
        return songs.filter(s =>
            (s.title || '').toLowerCase().includes(query) ||
            (s.artist_name || '').toLowerCase().includes(query)
        );
    }, [songs, query]);

    const matchedArtists = useMemo(() => {
        if (!query) return [];
        return artists.filter(a =>
            (a.artist_name || '').toLowerCase().includes(query)
        );
    }, [artists, query]);

    if (loading) return <Spinner label="Searching…" />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-display font-bold">
                Results for “{params.get('q')}”
            </h1>

            <section>
                <h2 className="text-lg font-display font-semibold mb-3">Artists</h2>
                {matchedArtists.length === 0 ? (
                    <EmptyState title="No matching artists" />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {matchedArtists.map(a => <ArtistChip key={a.user_id} artist={a} />)}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-lg font-display font-semibold mb-3">Songs</h2>
                {matchedSongs.length === 0 ? (
                    <EmptyState title="No matching songs" />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {matchedSongs.map(s => (
                            <SongCard key={s.id} song={s} queue={matchedSongs} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}