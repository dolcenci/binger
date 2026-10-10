// ---------------------------------------------------------
// Radio — 10 internet radio stations.
// Plays in the persistent bottom player.
//
// IMPORTANT:
//  - Streams marked [HTTPS] work on https:// deployments.
//  - Streams marked [HTTP]  only work on http://localhost.
//    When you deploy Binger behind HTTPS, proxy them
//    through your backend to avoid mixed-content blocking.
//  - Stations come and go. If one fails, open DevTools →
//    Console and look for [player] audio error. Replace the
//    url in the STATIONS list below.
// ---------------------------------------------------------
import { usePlayer } from '../context/AudioPlayerContext';

const STATIONS = [
    {
        id: 'radioparadise',
        name: 'Radio Paradise',
        genre: 'Eclectic',
        url: 'http://stream.radioparadise.com/aac-320',
        https: false,
        description: 'Hand-picked, listener-supported, no ads.',
    },
    {
        id: 'radioparadise-mellow',
        name: 'Radio Paradise — Mellow Mix',
        genre: 'Chill',
        url: 'http://stream.radioparadise.com/mellow-320',
        https: false,
        description: 'Downtempo, ambient, and soft edges.',
    },
    {
        id: 'radioparadise-rock',
        name: 'Radio Paradise — Rock Mix',
        genre: 'Rock',
        url: 'http://stream.radioparadise.com/rock-320',
        https: false,
        description: 'Riffs, distortion, and classic cuts.',
    },
    {
        id: 'somafm-groove-salad',
        name: 'SomaFM — Groove Salad',
        genre: 'Ambient',
        url: 'https://ice1.somafm.com/groovesalad-128-mp3',
        https: true,
        description: 'Chilled ambient and downtempo beats.',
    },
    {
        id: 'somafm-indie-pop-rocks',
        name: 'SomaFM — Indie Pop Rocks',
        genre: 'Indie',
        url: 'https://ice1.somafm.com/indiepop-128-mp3',
        https: true,
        description: 'Indie pop and modern rock.',
    },
    {
        id: 'somafm-drone-zone',
        name: 'SomaFM — Drone Zone',
        genre: 'Ambient',
        url: 'https://ice1.somafm.com/dronezone-128-mp3',
        https: true,
        description: 'Atmospheric textures — for deep work.',
    },
    {
        id: 'somafm-secret-agent',
        name: 'SomaFM — Secret Agent',
        genre: 'Lounge',
        url: 'https://ice1.somafm.com/secretagent-128-mp3',
        https: true,
        description: 'Spy jazz, downtempo, and cocktail noir.',
    },
    {
        id: 'somafm-u80s',
        name: 'SomaFM — Underground 80s',
        genre: '80s',
        url: 'https://ice1.somafm.com/u80s-128-mp3',
        https: true,
        description: 'Early-80s new wave and synth.',
    },
    {
        id: 'lounge-radio',
        name: 'Lounge Radio',
        genre: 'Lounge',
        url: 'http://stream.laut.fm/lounge',
        https: false,
        description: 'Smooth, relaxed, easy listening.',
    },
    {
        id: 'jazz-radio',
        name: 'Jazz Radio',
        genre: 'Jazz',
        url: 'http://stream.laut.fm/jazz',
        https: false,
        description: 'Classic and contemporary jazz.',
    },
];

export default function Radio() {
    const { playRadio, current, isPlaying, togglePlay } = usePlayer();

    function isCurrentStation(st) {
        return current?.source === 'radio' && current?.song?.audio_url === st.url;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold">Radio</h1>
                <p className="text-zinc-400 text-sm mt-2">
                    10 live streams. They play in the same bar as your songs.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {STATIONS.map(st => {
                    const active = isCurrentStation(st);
                    return (
                        <div key={st.id}
                             className={`card flex flex-col gap-3 transition
                             ${active ? 'ring-1 ring-brand-500/40 bg-brand-500/5' : ''}`}>
                            <div className="w-full aspect-square rounded-lg
                              bg-gradient-to-br from-brand-500 to-brand-300
                              flex items-center justify-center text-4xl text-white/80">
                                📻
                            </div>
                            <div className="min-w-0">
                                <div className="font-medium truncate" title={st.name}>{st.name}</div>
                                <div className="text-[11px] text-zinc-500 mt-0.5">
                                    {st.genre} · {st.https ? 'HTTPS' : 'HTTP'}
                                </div>
                                <div className="text-xs text-zinc-400 mt-1 line-clamp-2">
                                    {st.description}
                                </div>
                            </div>
                            <button
                                className={active ? 'btn btn-outline' : 'btn btn-primary'}
                                onClick={() => active ? togglePlay() : playRadio(st.url, st.name)}
                            >
                                {active ? (isPlaying ? 'Pause' : 'Resume') : 'Listen'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="text-xs text-zinc-500 border-t border-white/5 pt-4">
                Note: streams marked <span className="text-zinc-300">HTTP</span> only work
                on <code className="text-zinc-400">localhost</code>. Over HTTPS they're blocked
                by the browser as mixed content. Streams marked
                <span className="text-zinc-300"> HTTPS</span> work everywhere.
            </div>
        </div>
    );
}