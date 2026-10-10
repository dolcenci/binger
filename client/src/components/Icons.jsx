// ---------------------------------------------------------
// Small icon set — inline SVGs. stroke-based, currentColor.
// Usage: <Icon.Play className="w-5 h-5" />
// ---------------------------------------------------------
const base = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
};

export const Icon = {
    Home: (p) => (
        <svg {...base} {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 10v10h14V10" /></svg>
    ),
    Music: (p) => (
        <svg {...base} {...p}>
            <path d="M9 18V6l10-2v12" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" />
        </svg>
    ),
    Mic: (p) => (
        <svg {...base} {...p}>
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0" />
            <path d="M12 18v3M8 21h8" />
        </svg>
    ),
    Radio: (p) => (
        <svg {...base} {...p}>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M16 3 8 7" /><circle cx="8" cy="13.5" r="2" /><path d="M14 12h4M14 15h3" />
        </svg>
    ),
    User: (p) => (
        <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></svg>
    ),
    Grid: (p) => (
        <svg {...base} {...p}>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
    ),
    Dashboard: (p) => (
        <svg {...base} {...p}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
        </svg>
    ),
    Upload: (p) => (
        <svg {...base} {...p}>
            <path d="M12 16V4" /><path d="m7 9 5-5 5 5" />
            <path d="M4 20h16" />
        </svg>
    ),
    Play: (p) => (
        <svg {...base} {...p} fill="currentColor" stroke="none">
            <path d="M8 5v14l11-7z" />
        </svg>
    ),
    Pause: (p) => (
        <svg {...base} {...p} fill="currentColor" stroke="none">
            <rect x="7" y="5" width="3.5" height="14" rx="1" />
            <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
        </svg>
    ),
    Next: (p) => (
        <svg {...base} {...p} fill="currentColor" stroke="none">
            <path d="M6 5v14l9-7z" /><rect x="16" y="5" width="2.5" height="14" rx="1" />
        </svg>
    ),
    Prev: (p) => (
        <svg {...base} {...p} fill="currentColor" stroke="none">
            <path d="M18 5v14l-9-7z" /><rect x="5.5" y="5" width="2.5" height="14" rx="1" />
        </svg>
    ),
    Shuffle: (p) => (
        <svg {...base} {...p}>
            <path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5" />
        </svg>
    ),
    Repeat: (p) => (
        <svg {...base} {...p}>
            <path d="M17 2l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 22l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
    ),
    Heart: ({ filled, ...p }) => (
        <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}>
            <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
        </svg>
    ),
    Search: (p) => (
        <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
    ),
    Queue: (p) => (
        <svg {...base} {...p}>
            <path d="M4 6h12M4 12h12M4 18h8" /><path d="m18 16 3 2-3 2z" fill="currentColor" stroke="none" />
        </svg>
    ),
    Volume: (p) => (
        <svg {...base} {...p}>
            <path d="M3 10v4h4l5 4V6l-5 4H3z" /><path d="M16 8a6 6 0 0 1 0 8" />
        </svg>
    ),
    Mute: (p) => (
        <svg {...base} {...p}>
            <path d="M3 10v4h4l5 4V6l-5 4H3z" /><path d="m17 9 4 6M21 9l-4 6" />
        </svg>
    ),
    Plus: (p) => (
        <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
    ),
    ChevronRight: (p) => (
        <svg {...base} {...p}><path d="m9 6 6 6-6 6" /></svg>
    ),
    ChevronLeft: (p) => (
        <svg {...base} {...p}><path d="m15 6-6 6 6 6" /></svg>
    ),
    Fire: (p) => (
        <svg {...base} {...p}>
            <path d="M12 3c1 3 4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 0-5 0-7z" />
        </svg>
    ),
    Sparkles: (p) => (
        <svg {...base} {...p}>
            <path d="M12 3v4M12 17v4M5 12H1M23 12h-4" />
            <path d="m6.5 6.5 2 2M17.5 17.5l-2-2M17.5 6.5l-2 2M6.5 17.5l2-2" />
        </svg>
    ),
    Logout: (p) => (
        <svg {...base} {...p}><path d="M14 4h5v16h-5" /><path d="M10 8l-4 4 4 4M6 12h10" /></svg>
    ),
};