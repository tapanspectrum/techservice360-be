import { Server } from 'socket.io';
import { redisClient, redisSubscriber } from './utils/middlewares/redis';

let io: Server;
export const initWebSocket = (server: any) => {
    io = new Server(server, {
        cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
        socket.on('join', (userId: string) => {
            socket.join(userId); // Join a room named after the userId
        });
    });

    // Subscribe to Redis channels
    redisSubscriber.subscribe('notifications');

    // Listen for messages from Redis and emit to WebSocket clients
    redisSubscriber.on('message', (channel, message) => {
        if (channel === 'notifications') {
            const notification = JSON.parse(message);
            io.to(notification.user).emit('notification', notification);
        }
    });
    return io;
}