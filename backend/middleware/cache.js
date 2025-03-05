const setCacheControl = (duration) => {
    return (req, res, next) => {
        // Set cache control headers
        if (req.method === 'GET') {
            res.set('Cache-Control', `public, max-age=${duration}`);
            res.set('Expires', new Date(Date.now() + duration * 1000).toUTCString());
        } else {
            // For non-GET requests, prevent caching
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
        }
        next();
    };
};

// Cache durations in seconds
const CACHE_DURATIONS = {
    STATIC: 86400,    // 24 hours
    PRODUCTS: 3600,   // 1 hour
    CATEGORIES: 7200  // 2 hours
};

module.exports = {
    setCacheControl,
    CACHE_DURATIONS
};
