// ---------------------------------------------------------
// AudioPlayerContext.
// Single persistent <audio> + shuffle, repeat, queue helpers.
// ---------------------------------------------------------
import {
    createContext, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { songsApi } from '../api/songs';

const AudioPlayerContext = createContext(null);

const PLAY_THRESHOLD_SECONDS = 30;

export function AudioPlayerProvider({ children }) {
    const audioRef = useRef(null);

    const [current, setCurrent]         = useState(null);
    const [queue, setQueue]             = useState([]);
    const [isPlaying, setPlaying]       = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration]       = useState(0);
    const [volume, setVolume]           = useState(0.9);
    const [muted, setMuted]             = useState(false);
    const [error, setError]             = useState(null);
    const [shuffle, setShuffle]         = useState(false);
    const [repeat, setRepeat]           = useState('off'); // off | all | one

    const playReportedRef = useRef(false);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        const onTime = () => {
            setCurrentTime(el.currentTime);
            if (
                !playReportedRef.current &&
                current?.source === 'song' &&
                el.currentTime >= PLAY_THRESHOLD_SECONDS
            ) {
                playReportedRef.current = true;
                if (typeof current.song.id === 'number') {
                    songsApi.recordPlay(current.song.id, Math.floor(el.currentTime))
                        .catch(() => {});
                }
            }
        };
        const onLoaded = () => setDuration(el.duration || 0);
        const onPlay   = () => { setPlaying(true); setError(null); };
        const onPause  = () => setPlaying(false);
        const onEnded  = () => {
            setPlaying(false);
            if (repeat === 'one') {
                el.currentTime = 0;
                el.play().catch(() => {});
                return;
            }
            next();
        };
        const onVolume = () => { setMuted(el.muted); setVolume(el.volume); };
        const onError  = () => {
            const code = el.error?.code;
            const msg  = el.error?.message || 'Unknown media error';
            console.error('[player] audio error', { code, msg, src: el.src });
            setError(msg);
            setPlaying(false);
        };

        el.addEventListener('timeupdate', onTime);
        el.addEventListener('loadedmetadata', onLoaded);
        el.addEventListener('play', onPlay);
        el.addEventListener('pause', onPause);
        el.addEventListener('ended', onEnded);
        el.addEventListener('volumechange', onVolume);
        el.addEventListener('error', onError);

        return () => {
            el.removeEventListener('timeupdate', onTime);
            el.removeEventListener('loadedmetadata', onLoaded);
            el.removeEventListener('play', onPlay);
            el.removeEventListener('pause', onPause);
            el.removeEventListener('ended', onEnded);
            el.removeEventListener('volumechange', onVolume);
            el.removeEventListener('error', onError);
        };
    }, [current, queue, repeat]); // eslint-disable-line react-hooks/exhaustive-deps

    async function playSong(song, list = []) {
        const el = audioRef.current;
        if (!el) return;
        playReportedRef.current = false;
        setError(null);
        setQueue(list);

        const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
        const src  = song.audio_url?.startsWith('http')
            ? song.audio_url
            : `${base}${song.audio_url}`;

        el.src = src;
        el.load();
        setCurrent({ song, source: 'song' });

        try { await el.play(); } catch { setPlaying(false); }
    }

    async function playRadio(url, label = 'Radio') {
        const el = audioRef.current;
        if (!el) return;
        playReportedRef.current = true;
        setError(null);
        setQueue([]);

        el.src = url;
        el.load();
        setCurrent({
            song: {
                id: null,
                title: label,
                artist_name: 'Internet Radio',
                audio_url: url,
                cover_url: null,
            },
            source: 'radio',
        });

        try { await el.play(); } catch { setPlaying(false); }
    }

    function togglePlay() {
        const el = audioRef.current;
        if (!el || !current) return;
        if (el.paused) el.play().catch(() => {});
        else el.pause();
    }

    function seek(seconds) {
        const el = audioRef.current;
        if (!el) return;
        el.currentTime = seconds;
    }

    function setVolumeLevel(v) {
        const el = audioRef.current;
        if (!el) return;
        el.volume = Math.max(0, Math.min(1, v));
    }

    function toggleMute() {
        const el = audioRef.current;
        if (!el) return;
        el.muted = !el.muted;
    }

    function next() {
        if (!current || current.source !== 'song' || queue.length === 0) return;
        if (shuffle) {
            const s = queue[Math.floor(Math.random() * queue.length)];
            if (s) playSong(s, queue);
            return;
        }
        const idx = queue.findIndex(s => s.id === current.song.id);
        const s = queue[(idx + 1) % queue.length];
        if (s) playSong(s, queue);
    }

    function prev() {
        if (!current || current.source !== 'song' || queue.length === 0) return;
        const idx = queue.findIndex(s => s.id === current.song.id);
        const s = queue[(idx - 1 + queue.length) % queue.length];
        if (s) playSong(s, queue);
    }

    function toggleShuffle() { setShuffle(s => !s); }
    function cycleRepeat() {
        setRepeat(r => r === 'off' ? 'all' : r === 'all' ? 'one' : 'off');
    }

    function playFromQueue(index) {
        const s = queue[index];
        if (s) playSong(s, queue);
    }

    function removeFromQueue(index) {
        setQueue(q => q.filter((_, i) => i !== index));
    }

    const value = useMemo(() => ({
        current, queue, isPlaying, currentTime, duration, volume, muted, error,
        shuffle, repeat,
        playSong, playRadio, togglePlay, seek, setVolumeLevel, toggleMute,
        next, prev, toggleShuffle, cycleRepeat, playFromQueue, removeFromQueue,
    }), [current, queue, isPlaying, currentTime, duration, volume, muted, error, shuffle, repeat]);

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
            <audio ref={audioRef} preload="metadata" />
        </AudioPlayerContext.Provider>
    );
}

export function usePlayer() {
    const ctx = useContext(AudioPlayerContext);
    if (!ctx) throw new Error('usePlayer must be used inside <AudioPlayerProvider>');
    return ctx;
}