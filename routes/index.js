import server from '../components/Server/index.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';
import { verifyEnviroment } from '../utils/environment.js';
import { routers } from './index.routers.js';

const index = () => {
  const router = server.createRouterInstance();

  server.registerMultipleRouters({
    basePath: '/',
    baseRouter: router,
    routerConfigs: routers,
  });

  server.addCustomMiddleware({
    router,
    middleware: (err, _req, res, next) => {
      if (err) {
        return res.status(400).json({
          msg: err.message,
        });
      }
      next();
    },
  });

  return router;
};

export default index;
