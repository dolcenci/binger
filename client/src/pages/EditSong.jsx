// ---------------------------------------------------------
// Edit Song — artist only, own songs.
// ---------------------------------------------------------
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { songsApi } from '../api/songs';
import { uploadUrl } from '../lib/format';

export default function EditSong() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [song, setSong] = useState(null);

    const [form, setForm] = useState({
        title: '', artistName: '', description: '', lyrics: '',
    });
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [lyricsFile, setLyricsFile] = useState(null);

    useEffect(() => {
        songsApi.get(id)
            .then(d => {
                setSong(d.song);
                setForm({
                    title: d.song.title || '',
                    artistName: d.song.artist_name || '',
                    description: d.song.description || '',
                    lyrics: d.song.lyrics?.startsWith('/') || d.song.lyrics?.startsWith('http')
                        ? '' : (d.song.lyrics || ''),
                });
            })
            .catch(err => setError(err.response?.data?.error || err.message))
            .finally(() => setLoading(false));
    }, [id]);

    function update(key) {
        return (e) => setForm(f => ({ ...f, [key]: e.target.value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError(''); setBusy(true);
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('artistName', form.artistName);
            fd.append('description', form.description);
            fd.append('lyrics', form.lyrics);
            if (audioFile)  fd.append('audio', audioFile);
            if (coverFile)  fd.append('cover', coverFile);
            if (lyricsFile) fd.append('lyricsFile', lyricsFile);

            await songsApi.update(id, fd);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setBusy(false);
        }
    }

    if (loading) return <div className="text-zinc-500 text-sm">Loading…</div>;
    if (!song)   return <div className="text-red-400 text-sm">{error || 'Song not found'}</div>;

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-display font-bold">Edit Song</h1>

            <form onSubmit={onSubmit} className="card space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded overflow-hidden bg-ink-700 shrink-0">
                        <img src={uploadUrl(song.cover_url)} alt=""
                             className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm text-zinc-400">
                        Current cover. Upload a new one below to replace it.
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Title</label>
                    <input className="input" value={form.title} onChange={update('title')} required />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Artist name</label>
                    <input className="input" value={form.artistName} onChange={update('artistName')} required />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Description</label>
                    <textarea className="input" rows="3"
                              value={form.description} onChange={update('description')} />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">
                        Replace audio file (optional)
                    </label>
                    <input type="file" accept="audio/*"
                           onChange={(e) => setAudioFile(e.target.files[0] || null)}
                           className="text-sm text-zinc-400" />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">
                        Replace cover image (optional)
                    </label>
                    <input type="file" accept="image/*"
                           onChange={(e) => setCoverFile(e.target.files[0] || null)}
                           className="text-sm text-zinc-400" />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Lyrics (inline)</label>
                    <textarea className="input" rows="5"
                              value={form.lyrics} onChange={update('lyrics')} />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">
                        Replace lyrics with a .txt file (optional)
                    </label>
                    <input type="file" accept=".txt,text/plain"
                           onChange={(e) => setLyricsFile(e.target.files[0] || null)}
                           className="text-sm text-zinc-400" />
                </div>

                {error && (
                    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
                          rounded-lg px-3 py-2">{error}</div>
                )}

                <div className="flex gap-3">
                    <button className="btn btn-primary" disabled={busy}>
                        {busy ? 'Saving…' : 'Save changes'}
                    </button>
                    <button type="button" className="btn btn-ghost"
                            onClick={() => navigate('/dashboard')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}