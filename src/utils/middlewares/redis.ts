import Redis from "ioredis";

export const redisClient = new Redis({
    host: process.env.REDIS_HOST || '74.50.80.166',
    port: +(process.env.REDIS_PORT || 6379),
    retryStrategy(times) {
        // Reconnect after 2 seconds
        return Math.min(times * 2000, 10000);
    },
});
export const redisPublisher = new Redis({
    host: process.env.REDIS_HOST || '74.50.80.166',
    port: +(process.env.REDIS_PORT || 6379),
    retryStrategy(times) {
        // Reconnect after 2 seconds
        return Math.min(times * 2000, 10000);
    },
});
export const redisSubscriber = new Redis({
    host: process.env.REDIS_HOST || '74.50.80.166',
    port: +(process.env.REDIS_PORT || 6379),
    retryStrategy(times) {
        // Reconnect after 2 seconds
        return Math.min(times * 2000, 10000);
    },
});