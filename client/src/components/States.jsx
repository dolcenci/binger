// ---------------------------------------------------------
// Shared loading + empty state components.
// ---------------------------------------------------------

export function Spinner({ label = 'Loading…' }) {
    return (
        <div className="flex items-center gap-3 text-zinc-400 text-sm py-6">
            <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-brand-500
                      animate-spin" />
            <span>{label}</span>
        </div>
    );
}

export function EmptyState({ title, hint, action }) {
    return (
        <div className="card text-center py-10">
            <div className="text-3xl mb-3 text-zinc-600">♪</div>
            <div className="text-white font-medium mb-1">{title}</div>
            {hint && <div className="text-zinc-500 text-sm mb-4">{hint}</div>}
            {action}
        </div>
    );
}

export function ErrorState({ message }) {
    return (
        <div className="card text-center py-6">
            <div className="text-red-400 text-sm">{message}</div>
        </div>
    );
}