// ---------------------------------------------------------
// Profile — view + edit own profile.
// ---------------------------------------------------------
import { useEffect, useState } from 'react';
import { profileApi } from '../api/profile';
import { useAuth } from '../context/AuthContext';
import { uploadUrl } from '../lib/format';

export default function Profile() {
    const { user, isArtist } = useAuth();

    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: '', address: '', dateOfBirth: '', bio: '',
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        profileApi.me().then(d => {
            setProfile(d.user);
            setForm({
                name: d.user.name || '',
                address: d.user.address || '',
                dateOfBirth: d.user.date_of_birth ? d.user.date_of_birth.slice(0, 10) : '',
                bio: d.user.bio || '',
            });
        }).catch(err => setError(err.message));
    }, []);

    function update(key) {
        return (e) => setForm(f => ({ ...f, [key]: e.target.value }));
    }

    async function onSave(e) {
        e.preventDefault();
        setBusy(true); setError(''); setMsg('');
        try {
            await profileApi.update(form);
            if (photoFile) {
                const fd = new FormData();
                fd.append('photo', photoFile);
                await profileApi.uploadPhoto(fd);
            }
            const fresh = await profileApi.me();
            setProfile(fresh.user);
            setMsg('Profile saved.');
            setEditing(false);
            setPhotoFile(null);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setBusy(false);
        }
    }

    if (!profile) {
        return <div className="text-zinc-500 text-sm">Loading profile…</div>;
    }

    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-3xl font-display font-bold">Your Profile</h1>

            {/* Header card */}
            <div className="card flex items-center gap-5">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-ink-700 shrink-0">
                    {profile.profile_photo_url ? (
                        <img src={uploadUrl(profile.profile_photo_url)} alt=""
                             className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-zinc-500">
                            {profile.name?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <div className="text-xl font-semibold">{profile.name}</div>
                    <div className="text-sm text-zinc-400">{profile.email}</div>
                    <div className="text-xs mt-1 inline-block px-2 py-0.5 rounded
                          bg-brand-500/15 text-brand-300 capitalize">
                        {profile.role}
                    </div>
                    {isArtist && (
                        <div className="text-xs text-zinc-400 mt-2">
                            Balance: R{(Number(profile.total_earnings_milli || 0) / 1000).toFixed(3)}
                        </div>
                    )}
                </div>
            </div>

            {/* View / Edit toggle */}
            {msg && (
                <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20
                        rounded-lg px-3 py-2">{msg}</div>
            )}
            {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
                        rounded-lg px-3 py-2">{error}</div>
            )}

            {!editing ? (
                <div className="card space-y-3">
                    <Row label="Address"    value={profile.address || '—'} />
                    <Row label="Date of Birth" value={profile.date_of_birth?.slice(0, 10) || '—'} />
                    <Row label="Bio"        value={profile.bio || '—'} />
                    <button className="btn btn-primary mt-2" onClick={() => setEditing(true)}>
                        Edit profile
                    </button>
                </div>
            ) : (
                <form onSubmit={onSave} className="card space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1">Profile photo</label>
                        <input type="file" accept="image/*"
                               onChange={(e) => setPhotoFile(e.target.files[0] || null)}
                               className="text-sm text-zinc-400" />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1">Name</label>
                        <input className="input" value={form.name} onChange={update('name')} required />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1">Address</label>
                        <input className="input" value={form.address} onChange={update('address')} />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1">Date of birth</label>
                        <input className="input" type="date" value={form.dateOfBirth}
                               onChange={update('dateOfBirth')} />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1">Bio</label>
                        <textarea className="input" rows="4" value={form.bio} onChange={update('bio')} />
                    </div>
                    <div className="flex gap-3">
                        <button className="btn btn-primary" disabled={busy}>
                            {busy ? 'Saving…' : 'Save'}
                        </button>
                        <button type="button" className="btn btn-ghost"
                                onClick={() => setEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex gap-4">
            <div className="w-40 text-sm text-zinc-400 shrink-0">{label}</div>
            <div className="text-sm text-white whitespace-pre-wrap">{value}</div>
        </div>
    );
}