import ForgoutController from '../../controllers/forgoutController.js';
import server from '../../components/Server/index.js';

const forgoutRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleMethods({
    router,
    basePath: '/forgout',
    routeConfigs: [
      { method: 'post', handlers: [ForgoutController.forgoutPassword] },
      {
        method: 'post',
        subPath: '/code/:token',
        handlers: [ForgoutController.verifyCode],
      },
      {
        method: 'post',
        subPath: '/change/:token',
        handlers: [ForgoutController.changePassword],
      },
    ],
  });

  return router;
};

export default forgoutRouter;
