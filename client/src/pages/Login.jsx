// ---------------------------------------------------------
// Login — split-screen. Left: photograph. Right: form.
// ---------------------------------------------------------
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Login failed');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left — photo */}
            <div className="relative hidden lg:block">
                <img
                    src="https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=1600&q=70"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br
                        from-base-950/70 via-base-950/40 to-brand-500/30" />
                <div className="relative z-10 h-full flex flex-col justify-between p-12">
                    <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br
                             from-brand-500 to-cool-500
                             flex items-center justify-center
                             shadow-lg shadow-brand-500/40">
              <span className="text-white font-black font-display">B</span>
            </span>
                        <span className="text-2xl font-display font-extrabold text-cream-50">
              Binger
            </span>
                    </div>

                    <div>
                        <h2 className="font-display text-4xl font-extrabold text-cream-50
                           leading-tight mb-3 max-w-md">
                            Where independent music gets heard.
                        </h2>
                        <p className="text-cream-100/70 max-w-md">
                            Stream the catalogue. Support the artists you love.
                            R0.005 goes to them every play.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right — form */}
            <div className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden mb-8 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br
                             from-brand-500 to-cool-500
                             flex items-center justify-center">
              <span className="text-white font-black font-display">B</span>
            </span>
                        <span className="text-2xl font-display font-extrabold text-cream-50">
              Binger
            </span>
                    </div>

                    <h1 className="font-display text-3xl font-extrabold text-cream-50">
                        Sign in
                    </h1>
                    <p className="text-cream-100/50 mt-2 mb-8 text-sm">
                        New here?{' '}
                        <Link to="/register" className="text-brand-400 hover:text-brand-300">
                            Create an account
                        </Link>
                    </p>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider
                                text-cream-100/50 mb-2">Email</label>
                            <input
                                className="input" type="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com" required
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider
                                text-cream-100/50 mb-2">Password</label>
                            <input
                                className="input" type="password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" required
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-300 bg-red-500/10
                              border border-red-500/20 rounded-xl px-3 py-2">
                                {error}
                            </div>
                        )}

                        <button className="btn btn-primary w-full" disabled={busy}>
                            {busy ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}