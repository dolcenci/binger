// ---------------------------------------------------------
// Formatting helpers used across the UI.
// ---------------------------------------------------------

export function fmtTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Audio and cover URLs are now absolute (they point at
 * Neon Object Storage). Kept as a passthrough for safety.
 */
export function uploadUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
    return `${base}${path}`;
}