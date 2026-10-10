// ---------------------------------------------------------
// Central 404 + error handler.
// Any route that calls next(err) lands in errorHandler.
// ---------------------------------------------------------

export function notFound(req, res, _next) {
    res.status(404).json({
        ok: false,
        error: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}

export function errorHandler(err, _req, res, _next) {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal server error';

    if (process.env.NODE_ENV !== 'production') {
        console.error('[error]', err);
    }

    res.status(status).json({
        ok: false,
        error: message,
    });
}