// ---------------------------------------------------------
// ShelfRow — a horizontal scroll row of compact song cards.
// ---------------------------------------------------------
import { useRef } from 'react';
import ShelfCard from '../ShelfCard';
import { Icon } from '../Icons';

export default function ShelfRow({ title, sub, songs = [] }) {
    const scrollerRef = useRef(null);
    if (songs.length === 0) return null;

    function scroll(dir) {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * 640, behavior: 'smooth' });
    }

    return (
        <section>
            <div className="flex items-end justify-between mb-5 gap-4">
                <div className="min-w-0">
                    <h2 className="section-title truncate">{title}</h2>
                    {sub && <p className="section-sub truncate">{sub}</p>}
                </div>
                <div className="hidden md:flex items-center gap-1 shrink-0">
                    <button className="btn-icon" onClick={() => scroll(-1)} title="Back">
                        <Icon.ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="btn-icon" onClick={() => scroll(1)} title="Forward">
                        <Icon.ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollerRef}
                className="flex gap-4 overflow-x-auto pb-3
                   scrollbar-thin scroll-smooth"
                style={{ scrollbarWidth: 'thin' }}
            >
                {songs.map(s => (
                    <ShelfCard key={s.id} song={s} queue={songs} width={190} />
                ))}
            </div>
        </section>
    );
}