// ---------------------------------------------------------
// Register — split-screen, single-step for now.
// ---------------------------------------------------------
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '', password: '', name: '',
        role: 'listener', address: '', dateOfBirth: '', bio: '',
    });
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    function update(key) {
        return (e) => setForm(f => ({ ...f, [key]: e.target.value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            await register(form);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Registration failed');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="relative hidden lg:block">
                <img
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=70"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-br
                        from-base-950/70 via-base-950/40 to-cool-500/30" />
                <div className="relative z-10 h-full flex flex-col justify-between p-12">
                    <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br
                             from-brand-500 to-cool-500
                             flex items-center justify-center">
              <span className="text-white font-black font-display">B</span>
            </span>
                        <span className="text-2xl font-display font-extrabold text-cream-50">
              Binger
            </span>
                    </div>
                    <div>
                        <h2 className="font-display text-4xl font-extrabold text-cream-50
                           leading-tight mb-3 max-w-md">
                            Your sound, your audience.
                        </h2>
                        <p className="text-cream-100/70 max-w-md">
                            Artists get R0.005 per qualified play, full catalogue
                            control, and monthly payouts.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <h1 className="font-display text-3xl font-extrabold text-cream-50">
                        Create account
                    </h1>
                    <p className="text-cream-100/50 mt-2 mb-8 text-sm">
                        Already have one?{' '}
                        <Link to="/login" className="text-brand-400 hover:text-brand-300">
                            Sign in
                        </Link>
                    </p>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider
                                text-cream-100/50 mb-2">Email</label>
                            <input className="input" type="email" value={form.email}
                                   onChange={update('email')} required />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider
                                text-cream-100/50 mb-2">Password</label>
                            <input className="input" type="password" value={form.password}
                                   onChange={update('password')} required minLength={6} />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider
                                text-cream-100/50 mb-2">Name</label>
                            <input className="input" value={form.name}
                                   onChange={update('name')} required />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider
                                text-cream-100/50 mb-2">I am a…</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['listener', 'artist'].map(r => (
                                    <button
                                        key={r} type="button"
                                        onClick={() => setForm(f => ({ ...f, role: r }))}
                                        className={`px-4 py-2.5 rounded-xl text-sm capitalize
                                border transition-colors
                                ${form.role === r
                                            ? 'bg-brand-500/15 border-brand-500/40 text-brand-300'
                                            : 'border-white/[0.08] text-cream-100/70 hover:bg-white/[0.04]'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-300 bg-red-500/10
                              border border-red-500/20 rounded-xl px-3 py-2">
                                {error}
                            </div>
                        )}

                        <button className="btn btn-primary w-full" disabled={busy}>
                            {busy ? 'Creating…' : 'Create account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}