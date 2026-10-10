// ---------------------------------------------------------
// Global keyboard shortcuts.
//   Space        play/pause
//   ← / →        previous / next track
//   /            focus search
//   M            mute toggle
//   S            shuffle toggle
//   R            repeat cycle
//
// Skips while typing in inputs or textareas.
// ---------------------------------------------------------
import { useEffect } from 'react';
import { usePlayer } from '../context/AudioPlayerContext';

export default function useKeyboardShortcuts() {
    const {
        togglePlay, next, prev, toggleMute, toggleShuffle, cycleRepeat,
    } = usePlayer();

    useEffect(() => {
        function onKey(e) {
            const t = e.target;
            const isTyping =
                t instanceof HTMLInputElement ||
                t instanceof HTMLTextAreaElement ||
                t?.isContentEditable;

            if (isTyping) return;

            if (e.code === 'Space') {
                e.preventDefault();
                togglePlay();
            } else if (e.code === 'ArrowRight') {
                next();
            } else if (e.code === 'ArrowLeft') {
                prev();
            } else if (e.key === '/') {
                e.preventDefault();
                const input = document.querySelector('input[placeholder*="Search"]');
                input?.focus();
            } else if (e.key === 'm' || e.key === 'M') {
                toggleMute();
            } else if (e.key === 's' || e.key === 'S') {
                toggleShuffle();
            } else if (e.key === 'r' || e.key === 'R') {
                cycleRepeat();
            }
        }

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [togglePlay, next, prev, toggleMute, toggleShuffle, cycleRepeat]);
}