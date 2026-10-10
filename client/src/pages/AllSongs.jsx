// ---------------------------------------------------------
// AllSongs — full catalogue with a filter bar.
// ---------------------------------------------------------
import { useEffect, useMemo, useState } from 'react';
import { songsApi } from '../api/songs';
import SongCard from '../components/SongCard';
import { Spinner, EmptyState } from '../components/States';

const SORTS = [
    { id: 'recent',   label: 'Newest' },
    { id: 'plays',    label: 'Most played' },
    { id: 'hearts',   label: 'Most hearted' },
];

export default function AllSongs() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('recent');
    const [q, setQ] = useState('');

    useEffect(() => {
        songsApi.list()
            .then(d => setSongs(d.songs || []))
            .finally(() => setLoading(false));
    }, []);

    const visible = useMemo(() => {
        const filtered = q
            ? songs.filter(s =>
                (s.title || '').toLowerCase().includes(q.toLowerCase()) ||
                (s.artist_name || '').toLowerCase().includes(q.toLowerCase()))
            : songs;

        const copy = [...filtered];
        if (sort === 'plays')  copy.sort((a, b) => (b.plays || 0) - (a.plays || 0));
        if (sort === 'hearts') copy.sort((a, b) => (b.hearts || 0) - (a.hearts || 0));
        if (sort === 'recent') copy.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return copy;
    }, [songs, sort, q]);

    const maxPlays = useMemo(
        () => Math.max(1, ...songs.map(s => s.plays || 0)),
        [songs]
    );

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                    <h1 className="section-title">All songs</h1>
                    <p className="section-sub">{songs.length} songs in the catalogue</p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        className="input !w-64 !py-2"
                        placeholder="Filter…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <div className="flex rounded-full bg-white/[0.04] border border-white/[0.06] p-1">
                        {SORTS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setSort(s.id)}
                                className={`px-3 py-1.5 text-xs rounded-full transition-colors
                            ${sort === s.id
                                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                                    : 'text-cream-100/60 hover:text-white'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <Spinner label="Loading songs…" />
            ) : visible.length === 0 ? (
                <EmptyState title="No songs found" hint="Try a different search." />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {visible.map(s => (
                        <SongCard key={s.id} song={s} queue={visible} topPlays={maxPlays} />
                    ))}
                </div>
            )}
        </div>
    );
}