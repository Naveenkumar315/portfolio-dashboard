// utils/cache.js
import NodeCache from "node-cache";

// TTL (time to live) in seconds — e.g. cache for 60 seconds
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export function getCache(key) {
    return cache.get(key);
}

export function setCache(key, value) {
    cache.set(key, value);
}

export function clearCache() {
    cache.flushAll();
}
