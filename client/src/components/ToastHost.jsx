// ---------------------------------------------------------
// ToastHost — renders the current toasts.
// Mounted once inside the app shell.
// ---------------------------------------------------------
import { useToast } from '../context/ToastContext';

export default function ToastHost() {
    const { toasts, dismiss } = useToast();

    const colorFor = (kind) => {
        if (kind === 'success') return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200';
        if (kind === 'error')   return 'bg-red-500/15 border-red-500/40 text-red-200';
        return 'bg-white/10 border-white/20 text-white';
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2
                    pointer-events-none">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`pointer-events-auto min-w-[240px] max-w-sm px-4 py-2 rounded-lg
                      border shadow-lg backdrop-blur animate-slide-in
                      ${colorFor(t.kind)}`}
                    onClick={() => dismiss(t.id)}
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}