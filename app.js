import { config } from 'dotenv';
import connectMongo from './db/connect.js';
import server from './components/Server/index.js';
import cors from 'cors';
import Socket from './components/Socket/Server.js';

/* Routers */
import index from './routes/index.js';
import auth from './routes/auth.js';

config();
const { PORT, MONGODB_URI } = process.env;
const app = server.app;

export const socketServer = new Socket(app);
app.set('socketServer', socketServer);
const serverWithSocket = socketServer.getServer();

connectMongo(MONGODB_URI);
server.enableJsonMiddleware({ limit: '200kb' });
server.enableUrlEncodedMiddleware({ extended: true });
server.addCustomMiddleware({ middleware: cors() });

server.registerRoute({
  path: '/api',
  router: index(),
});
server.registerRoute({
  path: '/auth',
  router: auth(),
});

serverWithSocket.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
