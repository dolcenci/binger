// ---------------------------------------------------------
// LyricsPanel — shows lyrics for the current song.
// Hidden when nothing is playing or the song has no lyrics.
// ---------------------------------------------------------
import { useEffect, useState } from 'react';
import { songsApi } from '../api/songs';
import { usePlayer } from '../context/AudioPlayerContext';
import { useAuth } from '../context/AuthContext';

export default function LyricsPanel() {
    const { current } = usePlayer();
    const { isAuthenticated } = useAuth();
    const [lyrics, setLyrics] = useState('');
    const [loading, setLoading] = useState(false);

    const songId = current?.source === 'song' ? current.song.id : null;

    useEffect(() => {
        if (!songId) { setLyrics(''); return; }
        let cancel = false;
        setLoading(true);
        songsApi.get(songId)
            .then(d => {
                if (cancel) return;
                const l = d.song?.lyrics || '';
                if (l.startsWith('http')) {
                    setLyrics('(Lyrics are stored as a file — open in a new tab)');
                } else {
                    setLyrics(l);
                }
            })
            .catch(() => { if (!cancel) setLyrics(''); })
            .finally(() => { if (!cancel) setLoading(false); });
        return () => { cancel = true; };
    }, [songId]);

    if (!isAuthenticated || !songId) return null;
    if (loading) {
        return <div className="card text-zinc-500 text-sm">Loading lyrics…</div>;
    }
    if (!lyrics.trim()) return null;

    return (
        <div className="card">
            <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Lyrics</div>
            <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {lyrics}
            </div>
        </div>
    );
}