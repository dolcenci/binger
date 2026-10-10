// ---------------------------------------------------------
// ShelfCard — compact card used in horizontal shelf rows.
// ---------------------------------------------------------
import { usePlayer } from '../context/AudioPlayerContext';
import { uploadUrl } from '../lib/format';
import { Icon } from './Icons';

export default function ShelfCard({ song, queue, width = 200 }) {
    const { playSong, current, isPlaying } = usePlayer();
    const isCurrent = current?.song?.id === song.id;

    return (
        <button
            onClick={() => playSong(song, queue)}
            className="group shrink-0 text-left"
            style={{ width }}
        >
            <div className="relative aspect-square rounded-2xl overflow-hidden
                      bg-base-800 shadow-lg shadow-black/30
                      transition-transform duration-300
                      group-hover:scale-[1.02]">
                {song.cover_url ? (
                    <img
                        src={uploadUrl(song.cover_url)}
                        alt={song.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center
                          text-cream-100/25">
                        <Icon.Music className="w-12 h-12" />
                    </div>
                )}

                {/* hover play */}
                <div className={`absolute inset-0 bg-gradient-to-t
                         from-black/70 via-black/0 to-black/0
                         opacity-0 group-hover:opacity-100
                         transition-opacity flex items-end justify-end p-3`}>
          <span className="w-11 h-11 rounded-full bg-brand-500
                           flex items-center justify-center
                           shadow-xl shadow-brand-500/50">
            {isCurrent && isPlaying
                ? <Icon.Pause className="w-5 h-5 text-white" />
                : <Icon.Play className="w-5 h-5 text-white translate-x-[1px]" />}
          </span>
                </div>

                {isCurrent && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full
                          bg-black/50 backdrop-blur text-[10px] uppercase
                          tracking-wider text-brand-400 font-semibold">
                        Now
                    </div>
                )}
            </div>

            <div className="mt-3 min-w-0">
                <div className={`truncate text-sm font-semibold
                         ${isCurrent ? 'text-brand-400' : 'text-cream-50'}`}>
                    {song.title}
                </div>
                <div className="truncate text-xs text-cream-100/50 mt-0.5">
                    {song.artist_name}
                </div>
            </div>
        </button>
    );
}