// ---------------------------------------------------------
// Footer — minimal, brand-consistent.
// ---------------------------------------------------------
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="pt-12 mt-12 border-t border-white/[0.06]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br
                             from-brand-500 to-cool-500
                             flex items-center justify-center">
              <span className="text-white font-black text-xs font-display">B</span>
            </span>
                        <span className="font-display font-extrabold text-cream-50">Binger</span>
                    </div>
                    <p className="text-xs text-cream-100/50 max-w-xs">
                        Music for independent artists and the people who love them.
                    </p>
                </div>

                <FooterCol
                    title="Listen"
                    links={[
                        { label: 'Home', to: '/' },
                        { label: 'All songs', to: '/songs' },
                        { label: 'Podcasts', to: '/podcasts' },
                        { label: 'Radio', to: '/radio' },
                    ]}
                />
                <FooterCol
                    title="Your account"
                    links={[
                        { label: 'Profile', to: '/profile' },
                        { label: 'Dashboard', to: '/dashboard' },
                        { label: 'Upload', to: '/upload' },
                    ]}
                />
                <FooterCol
                    title="About"
                    links={[
                        { label: 'Payouts', to: '/dashboard' },
                        { label: 'Artist terms', to: '/dashboard' },
                    ]}
                />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between
                      mt-10 pt-6 border-t border-white/[0.06]
                      text-xs text-cream-100/40 gap-2">
                <span>© {new Date().getFullYear()} Binger. Made for the artists.</span>
                <span>R0.005 per qualified play · Monthly payouts</span>
            </div>
        </footer>
    );
}

function FooterCol({ title, links }) {
    return (
        <div>
            <div className="text-[10px] uppercase tracking-[0.16em]
                      text-cream-100/40 font-semibold mb-3">
                {title}
            </div>
            <ul className="space-y-2">
                {links.map(l => (
                    <li key={l.label}>
                        <Link to={l.to}
                              className="text-sm text-cream-100/60 hover:text-white
                             transition-colors">
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}