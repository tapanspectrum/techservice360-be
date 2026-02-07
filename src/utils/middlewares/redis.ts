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

// ✅ Handle error events
[redisClient, redisSubscriber].forEach((client, i) => {
  client.on('error', (err) => {
    console.error(`[Redis ${i === 0 ? 'Client' : 'Subscriber'} Error]:`, err.message);
  });

  client.on('connect', () => {
    console.log(`[Redis ${i === 0 ? 'Client' : 'Subscriber'}] Connected`);
  });

  client.on('reconnecting', () => {
    console.warn(`[Redis ${i === 0 ? 'Client' : 'Subscriber'}] Reconnecting...`);
  });
});