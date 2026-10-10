// ---------------------------------------------------------
// Upload Song — artist only.
// ---------------------------------------------------------
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { songsApi } from '../api/songs';

export default function Upload() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '', artistName: '', description: '', lyrics: '',
    });
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [lyricsFile, setLyricsFile] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    function update(key) {
        return (e) => setForm(f => ({ ...f, [key]: e.target.value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError('');

        if (!audioFile || !coverFile) {
            setError('Audio and cover files are required.');
            return;
        }

        setBusy(true);
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('artistName', form.artistName);
            fd.append('description', form.description);
            fd.append('lyrics', form.lyrics);
            fd.append('audio', audioFile);
            fd.append('cover', coverFile);
            if (lyricsFile) fd.append('lyricsFile', lyricsFile);

            await songsApi.upload(fd);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Upload failed');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-display font-bold">Upload a Song</h1>

            <form onSubmit={onSubmit} className="card space-y-4">
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Song title *</label>
                    <input className="input" value={form.title} onChange={update('title')} required />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Artist name *</label>
                    <input className="input" value={form.artistName} onChange={update('artistName')} required />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Description</label>
                    <textarea className="input" rows="3"
                              value={form.description} onChange={update('description')} />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Audio file * (mp3, wav, m4a, ogg)</label>
                    <input type="file" accept="audio/*"
                           onChange={(e) => setAudioFile(e.target.files[0] || null)}
                           className="text-sm text-zinc-400" />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Cover image * (jpg, png, webp)</label>
                    <input type="file" accept="image/*"
                           onChange={(e) => setCoverFile(e.target.files[0] || null)}
                           className="text-sm text-zinc-400" />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Lyrics (optional, inline)</label>
                    <textarea className="input" rows="5"
                              value={form.lyrics} onChange={update('lyrics')} />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">
                        Or upload a lyrics .txt file (optional)
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
                        {busy ? 'Uploading…' : 'Upload song'}
                    </button>
                    <button type="button" className="btn btn-ghost"
                            onClick={() => navigate('/dashboard')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}