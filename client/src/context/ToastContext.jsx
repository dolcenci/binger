// ---------------------------------------------------------
// ToastContext — small ephemeral notifications.
// Usage: const toast = useToast(); toast.success('Saved!')
// ---------------------------------------------------------
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts(t => t.filter(x => x.id !== id));
    }, []);

    const push = useCallback((kind, message, ms = 3500) => {
        const id = nextId++;
        setToasts(t => [...t, { id, kind, message }]);
        setTimeout(() => dismiss(id), ms);
    }, [dismiss]);

    const value = {
        toasts,
        dismiss,
        success: (msg) => push('success', msg),
        error:   (msg) => push('error',   msg),
        info:    (msg) => push('info',    msg),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}