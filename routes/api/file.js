import server from '../../components/Server/index.js';
import FileController from '../../controllers/fileController.js';

const fileRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleMethods({
    router,
    basePath: '/file',
    routeConfigs: [
      { method: 'get', subPath: '/:id', handlers: [FileController.getFile] },
    ],
  });

  return router;
};

export default fileRouter;
