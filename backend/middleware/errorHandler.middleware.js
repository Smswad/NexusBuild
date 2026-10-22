/**
 * 404 Route Not Found Handler
 */
export const notFoundHandler = (req, res, _next) => {
    return res.status(404).json({
        error: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, _next) => {
    if (res.headersSent) {
        return _next(err);
    }

    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
        console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
    }

    return res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
};

export default errorHandler;
