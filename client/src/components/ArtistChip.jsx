// ---------------------------------------------------------
// ArtistChip — redesigned.
// Big circular avatar, subtle glow, hover lift.
// ---------------------------------------------------------
import { Link } from 'react-router-dom';

// deterministic gradient from name so each artist looks distinct
function gradientFor(name = '') {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    const a = `hsl(${h}, 60%, 55%)`;
    const b = `hsl(${(h + 40) % 360}, 65%, 45%)`;
    return `linear-gradient(135deg, ${a}, ${b})`;
}

export default function ArtistChip({ artist }) {
    const initials = (artist.artist_name || '?')
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <Link
            to={`/artist/${artist.user_id}`}
            className="card card-hover flex items-center gap-4 group"
        >
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center
                   font-display font-bold text-white text-lg shrink-0
                   shadow-lg group-hover:scale-105 transition-transform"
                style={{ background: gradientFor(artist.artist_name) }}
            >
                {initials}
            </div>
            <div className="min-w-0">
                <div className="truncate font-semibold text-cream-50">
                    {artist.artist_name}
                </div>
                <div className="text-xs text-cream-100/50 mt-0.5">
                    {artist.song_count} song{artist.song_count === 1 ? '' : 's'} ·{' '}
                    {artist.total_plays} play{artist.total_plays === 1 ? '' : 's'}
                </div>
            </div>
        </Link>
    );
}