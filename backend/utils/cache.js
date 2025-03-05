const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes default TTL

const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        const key = req.originalUrl || req.url;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            res.send(JSON.parse(cachedResponse));
            return;
        } else {
            res.originalSend = res.send;
            res.send = (body) => {
                cache.set(key, JSON.stringify(body), duration);
                res.originalSend(body);
            };
            next();
        }
    };
};

module.exports = { cacheMiddleware, cache };
