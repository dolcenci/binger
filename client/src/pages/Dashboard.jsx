// ---------------------------------------------------------
// Artist Dashboard — your songs, earnings, banking, claim.
// ---------------------------------------------------------
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { songsApi } from '../api/songs';
import { earningsApi } from '../api/earnings';
import { uploadUrl } from '../lib/format';

const MIN_CLAIM_MILLI = 100_000; // R100.00

export default function Dashboard() {
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [earnings, setEarnings] = useState(null);
    const [banking, setBanking] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showBanking, setShowBanking] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    async function loadAll() {
        setLoading(true);
        try {
            const [s, e, b] = await Promise.all([
                songsApi.mine(),
                songsApi.mineEarnings(),
                earningsApi.getBanking(),
            ]);
            setSongs(s.songs || []);
            setEarnings(e);
            setBanking(b.banking);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadAll(); }, []);

    async function onDelete(id) {
        if (!confirm('Delete this song permanently?')) return;
        try {
            await songsApi.remove(id);
            setSongs(s => s.filter(x => x.id !== id));
            setMsg('Song deleted.');
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    }

    async function onSaveBanking(payload) {
        try {
            const r = await earningsApi.saveBanking(payload);
            setBanking(r.banking);
            setShowBanking(false);
            setMsg('Banking details saved.');
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            throw err;
        }
    }

    async function onClaim() {
        try {
            const r = await earningsApi.claim(true);
            setMsg(`Claimed R${r.amountRands}. Payout queued.`);
            setShowDisclaimer(false);
            await loadAll();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            throw err;
        }
    }

    const balanceMilli = earnings?.totalMilli || 0;
    const canClaim = banking && balanceMilli >= MIN_CLAIM_MILLI;

    if (loading) return <div className="text-zinc-500 text-sm">Loading dashboard…</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-display font-bold">Artist Dashboard</h1>
                <Link to="/upload" className="btn btn-primary">+ Upload song</Link>
            </div>

            {msg && (
                <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20
                        rounded-lg px-3 py-2">{msg}</div>
            )}
            {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
                        rounded-lg px-3 py-2">{error}</div>
            )}

            {/* Earnings summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                    <div className="text-xs uppercase tracking-wider text-zinc-500">Balance</div>
                    <div className="text-2xl font-display font-bold mt-1">
                        R{(balanceMilli / 1000).toFixed(3)}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                        Minimum claim: R{(MIN_CLAIM_MILLI / 1000).toFixed(2)}
                    </div>
                </div>

                <div className="card">
                    <div className="text-xs uppercase tracking-wider text-zinc-500">Banking</div>
                    <div className="text-sm mt-2 text-white">
                        {banking ? `${banking.bank_name} · ${banking.account_number}` : 'Not set'}
                    </div>
                    <button
                        className="btn btn-ghost text-xs mt-3"
                        onClick={() => setShowBanking(true)}
                    >
                        {banking ? 'Update banking' : 'Add banking details'}
                    </button>
                </div>

                <div className="card">
                    <div className="text-xs uppercase tracking-wider text-zinc-500">Claim</div>
                    <button
                        className="btn btn-primary mt-3 w-full"
                        disabled={!canClaim}
                        onClick={() => setShowDisclaimer(true)}
                    >
                        Claim earnings
                    </button>
                    {!banking && (
                        <div className="text-xs text-zinc-500 mt-2">
                            Add banking details first.
                        </div>
                    )}
                    {banking && balanceMilli < MIN_CLAIM_MILLI && (
                        <div className="text-xs text-zinc-500 mt-2">
                            Need R{((MIN_CLAIM_MILLI - balanceMilli) / 1000).toFixed(3)} more.
                        </div>
                    )}
                </div>
            </div>

            {/* Song list */}
            <section>
                <h2 className="text-xl font-display font-semibold mb-4">Your Songs</h2>
                {songs.length === 0 ? (
                    <div className="text-zinc-500 text-sm">
                        You haven't uploaded any songs yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {songs.map(song => {
                            const songRow = earnings?.songs?.find(x => x.id === song.id);
                            const earningsRands = songRow?.earnings_rands ?? '0.000';
                            return (
                                <div key={song.id}
                                     className="card flex items-center gap-4">
                                    <div className="w-14 h-14 rounded overflow-hidden bg-ink-700 shrink-0">
                                        {song.cover_url ? (
                                            <img src={uploadUrl(song.cover_url)} alt=""
                                                 className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-500">♪</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{song.title}</div>
                                        <div className="text-xs text-zinc-400 truncate">{song.artist_name}</div>
                                        <div className="text-xs text-zinc-500 mt-1">
                                            {song.plays} plays · R{earningsRands} earned
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            className="btn btn-ghost text-sm"
                                            onClick={() => navigate(`/song/${song.id}/edit`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-ghost text-sm text-red-400 hover:text-red-300"
                                            onClick={() => onDelete(song.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Modals */}
            {showBanking && (
                <BankingModal
                    initial={banking}
                    onClose={() => setShowBanking(false)}
                    onSave={onSaveBanking}
                />
            )}

            {showDisclaimer && (
                <DisclaimerModal
                    onClose={() => setShowDisclaimer(false)}
                    onAccept={onClaim}
                />
            )}
        </div>
    );
}

// =========================================================
// Banking modal
// =========================================================
function BankingModal({ initial, onClose, onSave }) {
    const [form, setForm] = useState({
        bankName:     initial?.bank_name     || '',
        accountNumber:initial?.account_number|| '',
        branchCode:   initial?.branch_code   || '',
        accountType:  initial?.account_type  || '',
    });
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');

    function update(key) {
        return (e) => setForm(f => ({ ...f, [key]: e.target.value }));
    }

    async function submit(e) {
        e.preventDefault();
        setBusy(true); setErr('');
        try {
            await onSave(form);
        } catch (e2) {
            setErr(e2.response?.data?.error || e2.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <Modal onClose={onClose} title="Banking Details">
            <form onSubmit={submit} className="space-y-3">
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Bank name</label>
                    <input className="input" value={form.bankName}
                           onChange={update('bankName')} required />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Account number</label>
                    <input className="input" value={form.accountNumber}
                           onChange={update('accountNumber')} required />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Branch code</label>
                    <input className="input" value={form.branchCode}
                           onChange={update('branchCode')} required />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Account type</label>
                    <input className="input" value={form.accountType}
                           onChange={update('accountType')} required />
                </div>
                {err && <div className="text-red-400 text-sm">{err}</div>}
                <div className="flex gap-3 pt-2">
                    <button className="btn btn-primary" disabled={busy}>
                        {busy ? 'Saving…' : 'Save banking'}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// =========================================================
// Disclaimer modal
// =========================================================
function DisclaimerModal({ onClose, onAccept }) {
    const [agreed, setAgreed] = useState(false);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');

    async function submit() {
        if (!agreed) return;
        setBusy(true); setErr('');
        try {
            await onAccept();
        } catch (e2) {
            setErr(e2.response?.data?.error || e2.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <Modal onClose={onClose} title="Earnings Disclaimer">
            <div className="text-sm text-zinc-300 space-y-3 max-h-80 overflow-y-auto pr-2">
                <p><strong className="text-white">Payment terms.</strong> You receive
                    R0.005 (five South African Rand cents) for each qualified play
                    of your song on Binger.</p>
                <p>A qualified play is a stream of at least 30 seconds by a
                    registered listener.</p>
                <p><strong className="text-white">Payment schedule.</strong> Payments
                    process monthly on the first business day. Minimum balance for
                    a claim is R100.</p>
                <p><strong className="text-white">Tax.</strong> You are responsible
                    for declaring and paying any taxes due on your earnings.</p>
                <p><strong className="text-white">Ownership.</strong> You warrant that
                    you own or have rights to all content you upload.</p>
                <p><strong className="text-white">General.</strong> Binger may
                    withhold payments if fraud or a terms violation is suspected.</p>
            </div>

            <label className="flex items-start gap-2 mt-4 text-sm text-zinc-300">
                <input type="checkbox"
                       className="mt-1"
                       checked={agreed}
                       onChange={(e) => setAgreed(e.target.checked)} />
                <span>I have read and agree to the terms.</span>
            </label>

            {err && <div className="text-red-400 text-sm mt-2">{err}</div>}

            <div className="flex gap-3 pt-4">
                <button className="btn btn-primary" disabled={!agreed || busy}
                        onClick={submit}>
                    {busy ? 'Claiming…' : 'Accept & claim'}
                </button>
                <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    );
}

// =========================================================
// Generic modal shell
// =========================================================
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative w-full max-w-lg card max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-display font-semibold">{title}</h3>
                    <button className="text-zinc-400 hover:text-white text-xl leading-none"
                            onClick={onClose}>×</button>
                </div>
                {children}
            </div>
        </div>
    );
}