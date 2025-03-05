const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: { error: message },
        standardHeaders: true,
        legacyHeaders: false
    });
};

// Different rate limiters for different routes
const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 requests
    'Too many login attempts. Please try again after 15 minutes.'
);

const apiLimiter = createRateLimiter(
    60 * 1000, // 1 minute
    100, // 100 requests
    'Too many requests. Please try again after a minute.'
);

const createAccountLimiter = createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3, // 3 requests
    'Too many accounts created. Please try again after an hour.'
);

module.exports = {
    authLimiter,
    apiLimiter,
    createAccountLimiter
};
