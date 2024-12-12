import server from '../components/Server/index.js';

/* Rutas de AUTH */
import loginRouter from './auth/login.js';
import registerRouter from './auth/register.js';
import forgoutRouter from './auth/forgout.js';

const auth = () => {
  const router = server.createRouterInstance();

  server.registerMultipleRouters({
    baseRouter: router,
    basePath: '/',
    routerConfigs: [loginRouter(), registerRouter(), forgoutRouter()],
  });

  return router;
};

export default auth;
