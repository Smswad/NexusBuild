/**
 * In-Memory Per-IP Rate Limiting Middleware
 * Tracks request counts per client IP over a sliding time window.
 */

export const createRateLimiter = ({
    windowMs = 60 * 1000, // 1 minute window
    max = 20,              // limit each IP to 20 requests per windowMs
    message = 'Too many requests. Please wait a minute before sending more messages.',
} = {}) => {
    const hits = new Map();

    // Periodic cleanup of stale IP records every 2 minutes to prevent memory leaks
    const cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [ip, record] of hits.entries()) {
            if (now - record.resetTime > windowMs) {
                hits.delete(ip);
            }
        }
    }, Math.max(windowMs * 2, 60000));

    // Allow Node process to exit cleanly without waiting on the timer
    if (cleanupInterval.unref) {
        cleanupInterval.unref();
    }

    return (req, res, next) => {
        // Extract client IP address safely behind proxies or directly
        const forwarded = req.headers['x-forwarded-for'];
        const clientIp = typeof forwarded === 'string'
            ? forwarded.split(',')[0].trim()
            : req.socket?.remoteAddress || req.ip || '127.0.0.1';

        const now = Date.now();
        let record = hits.get(clientIp);

        if (!record || now > record.resetTime) {
            record = {
                count: 1,
                resetTime: now + windowMs,
            };
            hits.set(clientIp, record);
        } else {
            record.count += 1;
        }

        const remaining = Math.max(0, max - record.count);
        const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);

        // Standard rate limit response headers
        res.setHeader('RateLimit-Limit', max);
        res.setHeader('RateLimit-Remaining', remaining);
        res.setHeader('RateLimit-Reset', Math.ceil(record.resetTime / 1000));

        if (record.count > max) {
            res.setHeader('Retry-After', retryAfterSeconds);
            return res.status(429).json({
                error: message,
                retryAfter: retryAfterSeconds,
            });
        }

        return next();
    };
};

export const chatRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 20,
    message: 'Too many chat requests from this IP. Please wait a moment before sending more messages.',
});

export default chatRateLimiter;
