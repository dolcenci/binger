// ---------------------------------------------------------
// Marquee — a slow, continuous horizontal scroll ticker.
// We duplicate the items so the loop is seamless.
// ---------------------------------------------------------
export default function Marquee({ items = [], speed = 40 }) {
    if (items.length === 0) return null;
    const doubled = [...items, ...items];

    return (
        <div className="relative overflow-hidden py-4
                    border-y border-white/[0.06]
                    bg-base-950/60">
            <div
                className="flex items-center gap-12 whitespace-nowrap"
                style={{
                    animation: `marquee ${speed}s linear infinite`,
                    width: 'max-content',
                }}
            >
                {doubled.map((it, i) => (
                    <span
                        key={i}
                        className="flex items-center gap-3 text-sm text-cream-100/60"
                    >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="font-medium text-cream-50">{it.title}</span>
            <span className="text-cream-100/40">·</span>
            <span>{it.artist_name}</span>
          </span>
                ))}
            </div>

            <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
}