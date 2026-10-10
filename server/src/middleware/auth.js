// ---------------------------------------------------------
// Auth middleware.
// Reads "Authorization: Bearer <token>" from the request,
// verifies it, and attaches req.user.
// Usage:   router.get('/protected', requireAuth, handler)
// ---------------------------------------------------------
import { verifyToken } from '../config/jwt.js';

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';

    if (!header.startsWith('Bearer ')) {
        return res.status(401).json({
            ok: false,
            error: 'Missing or malformed Authorization header',
        });
    }

    const token = header.slice('Bearer '.length).trim();

    try {
        const payload = verifyToken(token);
        // Attach what we know about the user to the request.
        // Route handlers downstream can read req.user.
        req.user = {
            id: payload.userId,
            email: payload.email,
            role: payload.role,
        };
        next();
    } catch (err) {
        return res.status(401).json({
            ok: false,
            error: 'Invalid or expired token',
        });
    }
}

/**
 * Optional helper for role-gated routes:
 *   router.post('/songs', requireAuth, requireRole('artist'), handler)
 */
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ ok: false, error: 'Not authenticated' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                ok: false,
                error: `Requires role: ${roles.join(' or ')}`,
            });
        }
        next();
    };
}