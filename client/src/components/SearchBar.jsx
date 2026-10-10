// ---------------------------------------------------------
// SearchBar — navigates to /search?q=...
// ---------------------------------------------------------
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const navigate = useNavigate();
    const [q, setQ] = useState('');

    function onSubmit(e) {
        e.preventDefault();
        const trimmed = q.trim();
        if (!trimmed) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }

    return (
        <form onSubmit={onSubmit} className="flex-1">
            <input
                className="input max-w-md"
                placeholder="Search songs or artists…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />
        </form>
    );
}