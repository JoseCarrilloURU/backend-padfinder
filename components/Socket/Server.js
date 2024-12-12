import { Server } from 'socket.io';
import { createServer } from 'http';

class SocketServer {
  constructor(app) {
    this.io = null;
    this.server = this.#createServer(app);
    this.userSocketMap = new Map();
  }

  #createServer(app) {
    const server = createServer(app);
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    this.#handleConnections();
    return server;
  }

  #handleConnections() {
    this.io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      socket.on('registerUser', ({ userId }) => {
        this.userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} register succesfully`);
      });

      socket.on('joinChat', ({ chatId }) => {
        socket.join(chatId);
        console.log(`User joined chat ${chatId}`);
      });

      socket.on('disconnect', () => {
        for (const [userId, socketId] of this.userSocketMap.entries()) {
          if (socketId === socket.id) {
            this.userSocketMap.delete(userId);
            break;
          }
        }
      });
    });
  }

  emitChatMessage = (chatId, messagePayload) => {
    if (!this.io) {
      throw new Error('Socket.IO instance is not initialized.');
    }
    this.io.to(chatId).emit('chatMessage', messagePayload);
    console.log(`Message sent to chat ${chatId}:`, messagePayload);
  };

  emitMatchEvent(userId, sourceUserInfo) {
    if (!this.io) {
      throw new Error('Socket.IO instance is not initialized.');
    }

    const socketId = this.userSocketMap.get(userId) || null;

    if (socketId) {
      this.io.to(socketId).emit('match', {
        msg: 'Nuevo match recibido',
        source_user: sourceUserInfo,
      });
      console.log(`Match event sent to socket ${socketId}:`, sourceUserInfo);
    }
  }

  getServer = () => this.server;
}

export default SocketServer;
