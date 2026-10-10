// ---------------------------------------------------------
// GenreTiles — colourful gradient tiles for mood browsing.
// Purely visual; links to /songs?  (We don't have genre
// filters in the DB yet, so tiles link to the full list.)
// ---------------------------------------------------------
import { Link } from 'react-router-dom';

const TILES = [
    { name: 'Pop',        color: 'from-[#ff6a2b] to-[#e8a598]' },
    { name: 'Hip-hop',    color: 'from-[#7c5cff] to-[#9b83ff]' },
    { name: 'Electronic', color: 'from-[#ff8352] to-[#7c5cff]' },
    { name: 'Jazz',       color: 'from-[#e8a598] to-[#ff6a2b]' },
    { name: 'Ambient',    color: 'from-[#7c5cff] to-[#e8a598]' },
    { name: 'R&B',        color: 'from-[#ff6a2b] to-[#ff8352]' },
    { name: 'Rock',       color: 'from-[#e8a598] to-[#7c5cff]' },
    { name: 'Classical',  color: 'from-[#9b83ff] to-[#ff6a2b]' },
];

export default function GenreTiles() {
    return (
        <section>
            <div className="mb-5">
                <h2 className="section-title">Browse by mood</h2>
                <p className="section-sub">A quick way in, whatever the vibe.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {TILES.map(t => (
                    <Link
                        key={t.name}
                        to="/songs"
                        className={`relative aspect-[5/3] rounded-2xl overflow-hidden
                        bg-gradient-to-br ${t.color}
                        border border-white/10
                        flex items-center justify-center
                        font-display font-extrabold text-xl text-white
                        shadow-lg shadow-black/30
                        hover:scale-[1.02] transition-transform`}
                    >
                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                        <span className="relative z-10 drop-shadow">{t.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}