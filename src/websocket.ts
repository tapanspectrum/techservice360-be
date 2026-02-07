import { Server } from 'socket.io';
import { redisClient, redisSubscriber } from './utils/middlewares/redis';

let io: Server;
export const initWebSocket = (server: any) => {
    io = new Server(server, {
        cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        socket.on('join', (userId: string) => {
            console.log(`User ${userId} joined with socket ID: ${socket.id}`);
            socket.join(userId); // Join a room named after the userId
        });

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });
    });

    // Subscribe to Redis channels
    redisSubscriber.subscribe('notifications', (err, count) => {
        if (err) {
            console.error('Failed to subscribe: %s', err.message);
        } else {
            console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
        }
    });

    // Listen for messages from Redis and emit to WebSocket clients
    redisSubscriber.on('message', (channel, message) => {
        if (channel === 'notifications') {
            const notification = JSON.parse(message);
            io.to(notification.user).emit('notification', notification);
        }
    });
    return io;
}